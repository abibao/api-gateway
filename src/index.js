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

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// initialize global.ABIBAO
global.ABIBAO = {
  starttime: new Date(),
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

// start all services
var services = require('./services')
services.bus()
  .then(function (item) {
    abibao.debug('bus initialized')
    return services.domain()
      .then(function () {
        abibao.debug('domain initialized')
        return services.server()
          .then(function () {
            abibao.debug('server initialized')
            abibao.debug('end processing')
            global.ABIBAO.services.server.start(function (error) {
              if (error) { return abibao.error(error) }
              abibao.debug('server has just started')
              global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_IS_ALIVE, 'rabbitmq is alive')
            })
          })
      })
  })
  .catch(function (error) {
    abibao.error(error)
  })
