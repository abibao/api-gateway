'use strict'

/*
====================================================
ROLES
====================================================
  - initialize engine (bus, cqrs, api)
  - initialize debuggers
  - initialize loggers
  - initialize services loaders
====================================================
*/

var Promise = require('bluebird')
var uuid = require('node-uuid')
var config = require('../config')

// streams of loggers
var streams = []
if (config('ABIBAO_API_GATEWAY_ENV') !== 'deve') {
  streams.push(require('./streams/logstash'))
}

// initialize global.ABIBAO
global.ABIBAO = {
  starttime: new Date(),
  environnement: config('ABIBAO_API_GATEWAY_ENV'),
  running: false,
  name: 'API GATEWAY',
  config,
  services: { },
  events: { },
  constants: {
    DomainConstant: { },
    ServerConstant: { }
  },
  debuggers: {
    error: require('debug')('abibao:error'),
    application: require('debug')('abibao:application'),
    bus: require('debug')('abibao:bus'),
    mysql: require('debug')('abibao:mysql'),
    domain: require('debug')('abibao:domain'),
    server: require('debug')('abibao:server'),
    socket: require('debug')('abibao:socket')
  },
  logger: require('bunyan').createLogger({
    name: 'api-gateway',
    level: 'info',
    streams
  })
}

global.ABIBAO.debuggers.application('start processing', config('ABIBAO_API_GATEWAY_ENV'))

var engine = function () {
  return new Promise(function (resolve, reject) {
    // start all services
    global.ABIBAO.running = false
    var services = require('./services')
    services.domain()
      .then(function () {
        global.ABIBAO.debuggers.application('domain initialized')
        return services.server()
      })
      .then(function () {
        global.ABIBAO.debuggers.application('server initialized')
        return services.bus()
      })
      .then(function () {
        global.ABIBAO.debuggers.application('bus initialized')
        global.ABIBAO.debuggers.application('end processing')
        global.ABIBAO.uuid = require('node-uuid').v4()
        global.ABIBAO.services.server.start(function (error) {
          if (error) { return global.global.ABIBAO.debuggers.error(error) }
          global.ABIBAO.debuggers.application('server has just started')
          global.ABIBAO.running = true
          var data = {
            uuid: uuid.v1(),
            environnement: global.ABIBAO.config('ABIBAO_API_GATEWAY_ENV'),
            version: process.env.npm_package_version,
            type: 'system',
            promise: 'engineInitializedSuccess'
          }
          global.ABIBAO.logger.info(data)
          resolve()
        })
      })
      .catch(function (error) {
        global.ABIBAO.running = false
        reject(error)
      })
  })
}

module.exports = engine
