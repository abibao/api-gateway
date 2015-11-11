"use strict";

var bunyan = require('bunyan');
var BunyanSlack = require('bunyan-slack');

var Hapi = require('hapi');
var Routes = require('./routes');

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

module.exports.start = function(callback) {
  if (process.env.ABIBAO_PRODUCTION) {
    server.logger = logger_file;
  } else {
    server.logger = logger_console;
  }
  server.logger_slack = logger_slack;
  server.logger.info('HAPI BOOTSTRAP');
  server.connection(options);
  callback();
  // start hapi
  var plugins = ['auth', 'swagger', 'blipp', 'rethink', 'redis'];
  if (process.env.ABIBAO_TEST) plugins = ['auth', 'rethink', 'redis'];
  var async = require('async');
  async.mapSeries(plugins, function(item, callback) {
    require('./plugins/'+item)(server, function() {
      callback(null, item);
    });
  }, function(err, results) {
    if (err) return callback(err);
    server.logger.info('HAPI PLUGINS LOADED', results);
    server.route(Routes.endpoints);
    server.start(function(err) {
      callback(err);
    });
  });
};

module.exports.server = server;

var logger_console = bunyan.createLogger({
  name: "api-gateway"
});

var logger_file = bunyan.createLogger({
    name: "api-gateway",
    streams: [{
        type: "rotating-file",
        path: '/var/log/foo.log',
        period: "1d",   // daily rotation
        count: 3        // keep 3 back copies
    }]
});

var logger_slack = bunyan.createLogger({
  name: "slack-gateway",
  stream: new BunyanSlack({
      webhook_url: "https://hooks.slack.com/services/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",
      icon_url: "https://secure.gravatar.com/avatar/3947e5c81a09471ff5d1213862ad5ea3.jpg",
      channel: "#gateway",
      username: "bunyan",
    })
});