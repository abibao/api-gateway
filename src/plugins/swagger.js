"use strict";

var HapiSwagger = require('hapi-swaggered');

var pkginfo = require( 'resolve-app-pkginfo' );
var pkg = pkginfo.sync();

// swagger
var options = {
  info: {
    version: pkg.version,
    title: pkg.name,
    description: pkg.description
  },
  cors: true
};
  
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

var SwaggerProvision = function(server, callback) {
  // route
  server.route({
    path: '/',
    method: 'GET',
    handler: function (request, reply) {
      reply.redirect('/docs');
    }
  });
  // register Swagger
  server.register([
    require('inert'),
    require('vision'),
    {
      register: HapiSwagger,
      options: options
    }], function (err) {
  	if (err) return console.log('swagger provision', err);
    console.log('swagger provision', 'registered');
    // register Swagger UI
    server.register([
    {
      register: require('hapi-swaggered-ui'),
      options: optionsui
    }], function (err) {
    	if (err) return console.log('swagger ui provision', err);
      console.log('swagger ui provision', 'registered');
      callback();
    });
  });
};

module.exports = SwaggerProvision;