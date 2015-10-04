'use strict';

var HapiSwagger = require('hapi-swaggered');
var HapiSwaggerUI = require('hapi-swaggered');

var pkginfo = require( 'resolve-app-pkginfo' );
var pkg = pkginfo.sync();

var SwaggerProvision = function(server) {
  
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
  	
  	if (err) return console.log(err);
    console.log('SwaggerProvision', 'registered');
    
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
  	
  	if (err) return console.log(err);
    console.log('SwaggerUIProvision', 'registered');
    
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