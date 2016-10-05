'use strict'

var Promise = require('bluebird')
var Boom = require('boom')
var YAML = require('yamljs')
var path = require('path')
var _ = require('lodash')

var internals = {
  options: {
    host: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_EXPOSE_IP'),
    port: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_EXPOSE_PORT'),
    labels: ['api', 'administrator']
  },
  constants: { },
  events: { },
  server: false
}

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.server,
  error: global.ABIBAO.debuggers.error
}

var uuid = require('node-uuid')
var async = require('async')
var Hapi = require('hapi')

internals.initialize = function () {
  abibao.debug('start initializing')
  return new Promise(function (resolve, reject) {
    try {
      // new hapi
      internals.server = new Hapi.Server({
        debug: false,
        connections: {
          routes: {
            cors: true
          }
        }
      })
      // inject endpoints
      var routes = []
      _.merge(routes, YAML.load(path.resolve(__dirname, 'configuration/routes/stats.yml')).routes)
      var endpoints = []
      _.map(routes, function (route) {
        abibao.debug('inject route %o', route)
        // init
        var endpoint = {}
        endpoint.method = route.method
        endpoint.path = route.path
        endpoint.config = {}
        // config
        endpoint.config.jsonp = route.jsonp
        // --- auth ot not to auth
        if (global.ABIBAO.environnement === 'prod') {
          endpoint.config.auth = route.auth
        } else {
          endpoint.config.auth = false
        }
        // --- validate
        var validate = route.validate || false
        if (validate) {
          endpoint.config.validate = {}
          if (validate.params) {
            endpoint.config.validate.params = require(path.resolve(__dirname, 'configuration/routes/stats.js'))[validate.params]
          }
          if (validate.payload) {
          }
        }
        // --- handler
        switch (route.handler.type) {
          case 'cqrs':
            endpoint.config.handler = function (request, reply) {
              var params = route.handler.params || false
              if (params !== false) {params = request[params]}
              global.ABIBAO.services.domain.execute(route.handler.method, route.handler.name, params)
                .then(function (json) {
                  reply(json)
                })
                .catch(function (error) {
                  reply(Boom.badRequest(error))
                })
            }
            break
          default:

        }
        endpoints.push(endpoint)
      })
      // start hapi
      internals.server.logger = global.ABIBAO.logger
      internals.server.connection(internals.options)
      internals.server.on('response', function (request) {
        var data = {
          uuid: uuid.v1(),
          environnement: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV'),
          type: 'hapi-request',
          request: request.id,
          info: request.info,
          method: request.method,
          path: request.path,
          params: request.params,
          payload: request.payload,
          exectime: request.info.responded - request.info.received
        }
        if (global.ABIBAO.environnement === 'prod') {
          global.ABIBAO.logger.info(data)
        }
        abibao.debug('[%s] %s (%sms)', data.method, data.path, data.exectime)
      })
      var plugins = ['inert', 'auth'] // 'crumb'
      async.mapSeries(plugins, function (item, next) {
        require('./plugins/' + item)(internals.server, function () {
          next(null, item)
        })
      }, function (err, results) {
        if (err) { return reject(err) }
        abibao.debug('plugins %o', results)
        internals.server.route(endpoints)
        resolve()
      })
    } catch (error) {
      abibao.error(error)
      reject(error)
    }
  })
}

module.exports.singleton = function () {
  return new Promise(function (resolve, reject) {
    if (internals.server !== false) { resolve() }
    internals.server = { }
    internals.initialize()
      .then(function () {
        global.ABIBAO.services.server = internals.server
        global.ABIBAO.events.ServerEvent = internals.events
        global.ABIBAO.constants.ServerConstant = internals.constants
        resolve()
      })
      .catch(function (error) {
        internals.server = false
        abibao.error(error)
        reject(error)
      })
  })
}
