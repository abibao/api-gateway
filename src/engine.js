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

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// initialize global.ABIBAO
global.ABIBAO = {
  starttime: new Date(),
  environnement: nconf.get('ABIBAO_API_GATEWAY_ENV'),
  running: false,
  name: 'API GATEWAY',
  nconf,
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
    domain: require('debug')('abibao:domain'),
    server: require('debug')('abibao:server'),
    socket: require('debug')('abibao:socket')
  },
  logger: require('bunyan').createLogger({
    name: 'api-gateway',
    level: 'info',
    streams: [{
      level: 'info',
      type: 'raw',
      stream: require('bunyan-logstash-tcp').createStream({
        host: nconf.get('ABIBAO_API_GATEWAY_LOGSTASH_HOST'),
        port: nconf.get('ABIBAO_API_GATEWAY_LOGSTASH_PORT')
      })
    }]
  })
}

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.application,
  error: global.ABIBAO.debuggers.error
}

abibao.debug('start processing')

var engine = function () {
  return new Promise(function (resolve, reject) {
    // start all services
    global.ABIBAO.running = false
    var services = require('./services')
    services.domain()
      .then(function () {
        abibao.debug('domain initialized')
        return services.server()
      })
      .then(function () {
        abibao.debug('server initialized')
        return services.bus()
      })
      .then(function () {
        abibao.debug('bus initialized')
        abibao.debug('end processing')
        global.ABIBAO.uuid = require('node-uuid').v4()
        global.ABIBAO.services.server.start(function (error) {
          if (error) { return abibao.error(error) }
          abibao.debug('server has just started')
          global.ABIBAO.running = true
          var data = {
            uuid: uuid.v1(),
            environnement: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV'),
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
