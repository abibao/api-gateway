'use strict'

var Promise = require('bluebird')

var internals = {
  options: {
    url: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_RABBITMQ_URL')
  },
  constants: { },
  events: {
    BUS_EVENT_WEBHOOK_SLACK: 'BUS_EVENT_WEBHOOK_SLACK' + '__' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_RABBITMQ_ENV'),
    BUS_EVENT_EMAIL_WELCOME: 'BUS_EVENT_EMAIL_WELCOME' + '__' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_RABBITMQ_ENV'),
    BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_STEP02: 'BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_STEP02' + '__' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_RABBITMQ_ENV')
  },
  bus: false
}

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.bus,
  error: global.ABIBAO.debuggers.error
}

internals.initialize = function () {
  abibao.debug('start initializing')
  return new Promise(function (resolve, reject) {
    try {
      internals.bus = require('servicebus').bus(internals.options)
      internals.bus.subscribe(internals.events.BUS_EVENT_WEBHOOK_SLACK, require('./handlers/webhook_slack'))
      internals.bus.subscribe(internals.events.BUS_EVENT_EMAIL_WELCOME, require('./handlers/email_welcome'))
      internals.bus.subscribe(internals.events.BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_STEP02, require('./handlers/email_abibao_affect_step02'))
      resolve()
    } catch (error) {
      abibao.error(error)
      reject(error)
    }
  })
}

module.exports.singleton = function () {
  return new Promise(function (resolve, reject) {
    if (internals.bus !== false) { resolve(internals.bus) }
    internals.bus = { }
    internals.initialize()
      .then(function () {
        global.ABIBAO.events.BusEvent = internals.events
        global.ABIBAO.events.BusConstant = internals.constants
        resolve(internals.bus)
      })
      .catch(function (error) {
        internals.bus = false
        abibao.error(error)
        reject(error)
      })
  })
}
