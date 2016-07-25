'use strict'

var Promise = require('bluebird')

var internals = {
  options: {
    url: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_RABBITMQ_URL')
  },
  constants: { },
  events: {
    BUS_EVENT_WEBHOOK_SLACK: 'BUS_EVENT_WEBHOOK_SLACK' + '_' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV').toUpperCase()
  },
  bus: false
}

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.bus,
  error: global.ABIBAO.debuggers.error
}

/* *****
send / listen for 1:1
publish / subscribe for 1:N
***** */
internals.initialize = function () {
  abibao.debug('start initializing')
  return new Promise(function (resolve, reject) {
    try {
      internals.bus = require('servicebus').bus(internals.options)
      internals.bus.listen(internals.events.BUS_EVENT_WEBHOOK_SLACK, require('./handlers/webhookSlackEventHandler'))
      resolve()
    } catch (error) {
      abibao.error(error)
      reject(error)
    }
  })
}

module.exports.singleton = function () {
  return new Promise(function (resolve, reject) {
    if (internals.bus !== false) { resolve() }
    internals.bus = { }
    internals.initialize()
      .then(function () {
        global.ABIBAO.services.bus = internals.bus
        global.ABIBAO.events.BusEvent = internals.events
        global.ABIBAO.events.BusConstant = internals.constants
        abibao.debug(global.ABIBAO.events.BusEvent)
        resolve()
      })
      .catch(function (error) {
        internals.bus = false
        abibao.error(error)
        reject(error)
      })
  })
}
