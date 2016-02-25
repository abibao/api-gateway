"use strict";

var Hapi = require('hapi');
var Routes = require('./server/routes');

var _ = require('lodash');
var async = require('async');
var bunyan = require('bunyan');

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

var Boom = require('boom');

module.exports.start_io = function(domain) {
  io.on("connection", function(socket) {
    
    // SocketConnectedEvent
    domain.logger.info('Socket connected with id='+socket.id);
    
    // AdministratorLoginWithCredentialsCommand
    socket.on('urn:socket:get:/v1/administrators/login', function(payload) {
      domain.logger.info('socket get /v1/administrators/login', socket.id);
      domain.AdministratorLoginWithCredentialsCommand(payload).then(function(credentials) {
        socket.emit('response:socket:get:/v1/administrators/login', credentials);
      })
      .catch(function(error) {
        socket.emit('response:socket:get:/v1/administrators/login', Boom.badRequest(error).output.payload);
      });
    });
    
    // SystemFindDataQuery >> EntityModel
    socket.on('urn:socket:get:/v1/entities', function(payload) {
      domain.logger.info('socket get /v1/entities', socket.id);
      domain.SystemFindDataQuery(domain.EntityModel, {}).then(function(entities) {
        socket.emit('response:socket:get:/v1/entities', entities);
      })
      .catch(function(error) {
        socket.emit('response:socket:get:/v1/entities', Boom.badRequest(error).output.payload);
      });
    });
    
  });
};

module.exports.start_domain = function(callback) {
  (process.env.ABIBAO_API_GATEWAY_PRODUCTION_ENABLE) ? domain.logger = logger_file : domain.logger = logger_console;
  domain.logger.info('--------------------------------------------------------------');
  domain.logger.info('DOMAIN BOOTSTRAP');
  domain.logger.info('--------------------------------------------------------------');
  var plugins = ['models', 'queries/system', 'commands/system', 'events/system', 'listeners/system', 'queries', 'commands', 'events', 'listeners'];
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
  //server.logger = logger_logstash;
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
      if (err) return callback(err);
      server.logger.info('--------------------------------------------------------------');
      server.logger.info('GATEWAY BOOTSTRAP');
      server.logger.info('--------------------------------------------------------------');
      _.forEach(server.plugins.blipp.text().split('\n'), function(item) {
        if (item!=='') server.logger.info(item.trim());
      });
      server.logger.info('--------------------------------------------------------------');
      callback();
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

// logger to logstash
/*var logger_console = bunyan.createLogger({
  streams: [{
    type: "raw",
    stream: require('bunyan-logstash').createStream({
      host: '127.0.0.1',
      port: 5000
    })
  }]
});*/

// logger to console (deve mode)
var logger_console = bunyan.createLogger({
  name: "api-gateway",
  level: 'debug'
});

// logger to console (production mode)
var logger_file = bunyan.createLogger({
  name: "api-gateway",
  level: 'debug',
  streams: [{
    type: "rotating-file",
    path: process.env.ABIBAO_API_GATEWAY_LOGS_FILE,
    period: "1d",   // daily rotation
    count: 3        // keep 3 back copies
  }]
});