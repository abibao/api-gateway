'use strict'

var Promise = require('bluebird')

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
      var plugins = ['good', 'auth', 'swagger']
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

module.exports.singleton = function () {
  return new Promise(function (resolve, reject) {
    if (internals.server !== false) { resolve(internals.server) }
    internals.server = { }
    internals.initialize()
      .then(function () {
        global.ABIBAO.events.ServerEvent = internals.events
        global.ABIBAO.constants.ServerConstant = internals.constants
        resolve(internals.server)
      })
      .catch(function (error) {
        internals.server = false
        abibao.error(error)
        reject(error)
      })
  })
}
