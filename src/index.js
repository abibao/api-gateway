'use strict';

var Hapi = require('hapi');
var SocketIO = require('socket.io');

var server = new Hapi.Server({
  debug: false,
  connections: {
    routes: {
      cors: true
    }
  }
});

server.connection({ 
  host: process.env.ABIBAO_API_REST__EXPOSE_IP || '0.0.0.0',
  port: process.env.ABIBAO_API_REST__EXPOSE_PORT || 8080,
  labels: ['api']
});

var io = SocketIO.listen(server.listener);
io.sockets.on('connection', function(socket) {
  socket.emit({ msg: 'welcome' });
});

server.start(function () { 
	console.log('Server running at:', server.info.uri);
});