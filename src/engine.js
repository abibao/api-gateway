'use strict'

/*
====================================================
ROLES
====================================================
  - initialize application in node global
  - initialize debuggers
  - initialize loggers
  - initialize services loaders
====================================================
*/

var Promise = require('bluebird')

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// initialize global.ABIBAO
global.ABIBAO = {
  starttime: new Date(),
  environnement: nconf.get('ABIBAO_API_GATEWAY_RABBITMQ_ENV'),
  name: 'API GATEWAY',
  uuid: require('node-uuid').v4(),
  nconf: nconf,
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
    server: require('debug')('abibao:server')
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

// use new relic agent
require('newrelic')

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.application,
  error: global.ABIBAO.debuggers.error
}

abibao.debug('start processing')

var engine = function () {
  return new Promise(function (resolve, reject) {
    // start all services
    var services = require('./services')
    services.bus()
      .then(function () {
        abibao.debug('bus initialized')
        return services.domain()
      })
      .then(function () {
        abibao.debug('domain initialized')
        return services.server()
      })
      .then(function () {
        abibao.debug('server initialized')
        abibao.debug('end processing')
        global.ABIBAO.services.server.start(function (error) {
          if (error) { return abibao.error(error) }
          abibao.debug('server has just started')
          global.ABIBAO.services.bus.publish(global.ABIBAO.events.BusEvent.BUS_EVENT_IS_ALIVE, {
            name: global.ABIBAO.name,
            uuid: global.ABIBAO.uuid,
            message: 'has just connected into the bus'
          })
          resolve()
        })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

module.exports = engine
