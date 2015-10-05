'use-strict';

var Hapi = require('hapi');
var Routes = require('./routes');

// !-- FOR TESTS
var options = {
  host: process.env.ABIBAO_API_REST_EXPOSE_HOST || '0.0.0.0',
  port: process.env.ABIBAO_API_REST_EXPOSE_PORT || 8080,
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

var async = require('async');
async.mapSeries(['swagger', 'blipp', 'auth', 'good'], function(item, callback) {
  require('./plugins/'+item)(server);
  callback(null, item);
}, function(err, results) {
  server.route(Routes.endpoints);
  server.start(function() {
    console.log('Server started ', server.info.uri);
  });
});

// !-- FOR TESTS
module.exports = server;
// --!