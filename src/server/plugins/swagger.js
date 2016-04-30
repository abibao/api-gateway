'use strict'

var HapiSwagger = require('hapi-swaggered')

var pkginfo = require('resolve-app-pkginfo')
var pkg = pkginfo.sync()
var path = require('path')

// swagger
var options = {
  stripPrefix: '/v1',
  supportedMethods: ['get', 'post', 'delete', 'patch'],
  info: {
    version: pkg.version,
    title: pkg.name,
    description: pkg.description
  },
  cors: true,
  tagging: {
    mode: 'tags'
  },
  tags: {
    'administrators': 'Administrator description'
  }
}

// swaggerui
var optionsui = {
  title: '[abibao] api gateway',
  path: '/docs',
  templates: path.join(__dirname, './swagger-templates'),
  authorization: {
    field: 'Authorization',
    scope: 'header',
    placeholder: 'Saisir votre token ici...'
  }
}

var SwaggerProvision = function (server, callback) {
  // route
  server.route({
    path: '/',
    method: 'GET',
    handler(request, reply) {
      reply.redirect('/docs')
    }
  })
  // register Swagger
  server.register([
    require('inert'),
    require('vision'), {
      register: HapiSwagger,
    options}],
    function (err) {
      if (err) { return callback(err) }
      // register Swagger UI
      server.register([
        {
          register: require('hapi-swaggered-ui'),
          options: optionsui
        }], {
        select: 'api'
      }, function (err) {
        if (err) { return callback(err) }
        callback()
      })
    })
}

module.exports = SwaggerProvision
