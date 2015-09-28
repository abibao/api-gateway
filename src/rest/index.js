'use strict';

var Hapi = require('hapi');

var server = new Hapi.Server({
  debug: {
    log: ['all']
  },
  connections: {
    routes: {
      cors: true
    }
  }
});

server.connection({ 
  host: process.env.ABIBAO_API_REST__IP || '0.0.0.0',
  port: process.env.ABIBAO_API_REST__PORT || 8080,
  labels: ['api']
});

server.start(function () { 
	server.log('Server running at:', server.info.uri);
});