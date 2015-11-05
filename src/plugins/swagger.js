"use strict";

var HapiSwagger = require('hapi-swaggered');

var pkginfo = require( 'resolve-app-pkginfo' );
var pkg = pkginfo.sync();

var SwaggerProvision = function(server, seneca) {
  
  // swagger
  
  var options = {
    info: {
      version: pkg.version,
      title: pkg.name,
      description: pkg.description
    },
    cors: true
  };
  
  server.register([
    require('inert'),
    require('vision'),
    {
      register: HapiSwagger,
      options: options
    }], function (err) {
  	
  	if (err) return seneca.log.error('swagger provision', err);
    seneca.log.info('swagger provision', 'registered');
    
  });
  
  // swaggerui
  
  var optionsui = {
    title: 'API GATEWAY',
    path: '/docs',
    authorization: {
      field: 'Authorization',
      scope: 'header',
      placeholder: 'Saisir votre token ici...'
    }
  };
  
  server.register([
    {
      register: require('hapi-swaggered-ui'),
      options: optionsui
  }], function (err) {
  	
  	if (err) return seneca.log.error('swagger ui provision', err);
    seneca.log.info('swagger ui provision', 'registered');
    
  });
  
  // route
  server.route({
    path: '/',
    method: 'GET',
    handler: function (request, reply) {
      reply.redirect('/docs');
    }
  });
  
};

module.exports = SwaggerProvision;