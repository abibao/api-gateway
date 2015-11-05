"use strict";

var Hapi = require('hapi');
var Routes = require('./routes');
var seneca = require('seneca')();

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
var io;

module.exports.start = function(callback) {
  server.connection(options);
  io = require('socket.io')(server.listener);
  seneca.ready(function(err) {
    if (err) return console.log(err);
    var ioHandler = function (socket) {
      seneca.log.info('Connection to client established', socket.id);
    };
    // listen io
    io.on("connection", ioHandler);
    // start hapi
    var plugins = ['auth', 'swagger', 'blipp', 'good'];
    if (process.env.ABIBAO_NPM_TEST_ENABLE) plugins = ['auth', 'hapi-seneca'];
    var async = require('async');
    async.mapSeries(plugins, function(item, callback) {
      require('./plugins/'+item)(server, seneca);
      callback(null, item);
    }, function(err, results) {
      if (err) return callback(err);
      seneca.log.info('hapi plugins', results);
      server.route(Routes.endpoints);
      server.start(function(err) {
        callback(err);
      });
    });
  });
};

module.exports.server = server;
module.exports.seneca = seneca;
module.exports.io = io;