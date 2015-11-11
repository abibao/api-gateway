"use strict";

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
  server.connection(options);
  // start hapi
  var plugins = ['auth', 'swagger', 'blipp', 'good', 'rethink'];
  if (process.env.ABIBAO_NPM_TEST_ENABLE) plugins = ['auth', 'rethink'];
  var async = require('async');
  async.mapSeries(plugins, function(item, callback) {
    require('./plugins/'+item)(server, function() {
      callback(null, item);
    });
  }, function(err, results) {
    if (err) return callback(err);
    console.log('hapi plugins', results);
    server.route(Routes.endpoints);
    server.start(function(err) {
      callback(err);
    });
  });
};

module.exports.server = server;