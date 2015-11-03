"use strict";

var Hapi = require('hapi');
var Routes = require('./routes');

// !-- FOR TESTS
var options = {
  host: process.env.ABIBAO_API_GATEWAY_EXPOSE_IP || '0.0.0.0',
  port: process.env.ABIBAO_API_GATEWAY_EXPOSE_PORT || 8080,
  labels: ['api']
};
// --!

var server = new Hapi.Server({
  debug: false,
  connections: {
    routes: {
      cors: true
    }
  }
});

server.connection(options);

if (!process.env.ABIBAO_NPM_TEST_ENABLE) {
  var async = require('async');
  async.mapSeries(['swagger', 'blipp', 'auth', 'good'], function(item, callback) {
    require('./plugins/'+item)(server);
    callback(null, item);
  }, function(err, results) {
    if (!err && results) server.route(Routes.endpoints);
  });
} else {
  server.route(Routes.endpoints);
}
// !-- FOR TESTS
module.exports = server;
// --!