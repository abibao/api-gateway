"use strict";

var bunyan = require('bunyan');
var BunyanSlack = require('bunyan-slack');

var Hapi = require('hapi');
var Routes = require('./routes');
var Sockets = require('./sockets');

var options = {
  host: process.env.ABIBAO_API_GATEWAY_EXPOSE_IP || process.env.IP,
  port: process.env.ABIBAO_API_GATEWAY_EXPOSE_PORT || process.env.PORT,
  labels: ['api']
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

module.exports.start_io = function() {
  io.logger = server.logger;
  io.on("connection", Sockets.connectionHandler);
};

module.exports.start_server = function(callback) {
  server.logger = logger_console;
  if (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) server.logger = logger_file;
  server.logger_slack = logger_slack;
  server.logger.info('--------------------------------------------------------------');
  server.logger.info('HAPI BOOTSTRAP');
  server.logger.info('--------------------------------------------------------------');
  // start hapi
  var plugins = ['good', 'auth', 'swagger', 'blipp', 'rethink'];
  var async = require('async');
  async.mapSeries(plugins, function(item, callback) {
    require('./plugins/'+item)(server, function() {
      callback(null, item);
    });
  }, function(err, results) {
    if (err) return callback(err);
    server.logger.info('HAPI PLUGINS LOADED', results);
    server.route(Routes.endpoints);
    // routes
    if (!process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) {
      server.route({
        path: '/public/{param*}',
        method: 'GET',
        handler: {
          directory: {
            path: require('path').resolve(__dirname, '../public'),
            listing: true
          }
        }
      });
    }
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
  return require('./domain');
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
        path: process.env.ABIBAO_API_GATEWAY_LOGS_FILE || '/home/ubuntu/workspace/logs/api-gateway.log',
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