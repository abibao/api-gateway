'use strict'

var Promise = require('bluebird')

var internals = {
  options: {
    host: global.ABIBAO.config('ABIBAO_API_GATEWAY_EXPOSE_HOST'),
    port: global.ABIBAO.config('ABIBAO_API_GATEWAY_EXPOSE_PORT'),
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
        environnement: global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV'),
        type: 'hapi-request',
        request: request.id,
        info: request.info,
        method: request.method,
        path: request.path,
        params: request.params,
        payload: request.payload,
        exectime: request.info.responded - request.info.received
      }
      global.ABIBAO.logger.info(data)
      abibao.debug('[%s] %s (%sms)', data.method, data.path, data.exectime)
    })
    var plugins = ['inert', 'auth', 'nes']
    async.mapSeries(plugins, function (item, next) {
      require('./plugins/' + item)(internals.server, function () {
        next(null, item)
      })
    }, function (err, results) {
      if (err) { return reject(err) }
      abibao.debug('plugins %o', results)
      internals.server.auth.default('jwt')
      internals.server.route(Routes.endpoints)
      resolve()
    })
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
