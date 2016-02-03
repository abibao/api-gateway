"use strict";

var Hapi = require('hapi');
var Routes = require('./gateway/routes');
var Sockets = require('./io/sockets');

var async = require('async');
var bunyan = require('bunyan');
var BunyanSlack = require('bunyan-slack');

var options = {
  host: process.env.ABIBAO_API_GATEWAY_EXPOSE_IP,
  port: process.env.ABIBAO_API_GATEWAY_EXPOSE_PORT,
  labels: ['api', 'administrator']
};

var server = new Hapi.Server({
  debug: false,
  connections: {
    routes: {
      cors: true
    }
  }
});
server.connection(options);
var io = require("socket.io")(server.listener);
var domain = require('./domain');

module.exports.start_io = function() {
  io.logger = server.logger;
  io.on("connection", Sockets.connectionHandler);
};

module.exports.start_domain = function(callback) {
  (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) ? domain.logger = logger_file : domain.logger = logger_console;
  domain.logger.info('--------------------------------------------------------------');
  domain.logger.info('DOMAIN BOOTSTRAP');
  domain.logger.info('--------------------------------------------------------------');
  var plugins = ['models', 'queries', 'commands', 'events', 'listeners'];
  async.mapSeries(plugins, function(item, next) {
    domain.injector(item, function(error, result) {
      next(error, result);
    });
  }, function(err, results) {
    callback(err);
  });
};

module.exports.start_server = function(callback) {
  (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) ? server.logger = logger_file : server.logger = logger_console;
  server.logger.info('--------------------------------------------------------------');
  server.logger.info('SERVER BOOTSTRAP');
  server.logger.info('--------------------------------------------------------------');
  var plugins = ['good', 'auth', 'swagger', 'blipp'];
  async.mapSeries(plugins, function(item, next) {
    require('./server/plugins/'+item)(server, function() {
      next(null, item);
    });
  }, function(err, results) {
    if (err) return callback(err);
    server.logger.info('[HapiPlugins]', results);
    server.route(Routes.endpoints);
    // start
    server.start(function(err) {
      callback(err);
    });
  });
};

module.exports.io = function() {
  return io;
};

module.exports.server = function() {
  return server;
};

module.exports.domain = function() {
  return domain;
};

// logger to console (deve mode)
var logger_console = bunyan.createLogger({
  name: "api-gateway",
  level: 'debug'
});

// logger to console (production mode)
var logger_file = bunyan.createLogger({
  name: "api-gateway",
  level: 'info',
  streams: [{
    type: "rotating-file",
    path: process.env.ABIBAO_API_GATEWAY_LOGS_FILE,
    period: "1d",   // daily rotation
    count: 3        // keep 3 back copies
  }]
});

// logger to post on slack
var logger_slack = bunyan.createLogger({
  name: "slack-gateway",
  level: 'info',
  stream: new BunyanSlack({
      webhook_url: "https://hooks.slack.com/services/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",
      icon_url: "https://secure.gravatar.com/avatar/3947e5c81a09471ff5d1213862ad5ea3.jpg",
      channel: "#gateway",
      username: "AbibaoLogger",
    })
});