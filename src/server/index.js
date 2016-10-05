'use strict'

var Promise = require('bluebird')
var Boom = require('boom')

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
var Routes = require('./routes')

internals.initialize = function () {
  abibao.debug('start initializing')
  return new Promise(function (resolve, reject) {
    try {
      internals.server = new Hapi.Server({
        debug: false,
        connections: {
          routes: {
            cors: true
          }
        }
      })
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
        internals.server.route(Routes.endpoints)
        resolve()
      })
    } catch (error) {
      abibao.error(error)
      reject(error)
    }
  })
}

internals.commandHandler = function (reply, name, params) {
  abibao.debug('hapi handler command=%s', name)
  global.ABIBAO.services.domain.execute('command', name, params)
    .then(function (json) {
      reply(json)
    })
    .catch(function (error) {
      reply(Boom.badRequest(error))
    })
}

internals.queryHandler = function (reply, name, params) {
  abibao.debug('hapi handler query=%s', name)
  global.ABIBAO.services.domain.execute('query', name, params)
    .then(function (json) {
      reply(json)
    })
    .catch(function (error) {
      reply(Boom.badRequest(error))
    })
}

module.exports.singleton = function () {
  return new Promise(function (resolve, reject) {
    if (internals.server !== false) { resolve() }
    internals.server = { }
    internals.initialize()
      .then(function () {
        internals.server.commandHandler = internals.commandHandler
        internals.server.queryHandler = internals.queryHandler
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
