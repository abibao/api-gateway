'use strict'

var Promise = require('bluebird')
var _ = require('lodash')
var rp = require('request-promise')

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    var payload = _.clone(message)
    delete payload.webhook
    var options = {
      method: 'POST',
      uri: message.webhook,
      body: payload,
      json: true
    }
    rp(options)
      .then(function () {
        global.ABIBAO.debuggers.bus('BUS_EVENT_WEBHOOK_SLACK "%s" has been posted', message.text)
        resolve()
      })
      .catch(function () {
        global.ABIBAO.debuggers.error('BUS_EVENT_WEBHOOK_SLACK "%s" has not been posted', message.text)
        reject()
      })
  })
}
