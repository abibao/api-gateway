'use strict'

var _ = require('lodash')
var rp = require('request-promise')

module.exports = function (message) {
  var payload = _.clone(message)
  delete payload.webhook

  var options = {
    method: 'POST',
    uri: message.webhook,
    body: payload,
    json: true
  }

  if (global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_ENV') === 'prod') {
    rp(options)
      .then(function () {
        global.ABIBAO.debuggers.bus('BUS_EVENT_WEBHOOK_SLACK "%s" has been posted', message.text)
      })
      .catch(function () {
        global.ABIBAO.debuggers.error('BUS_EVENT_WEBHOOK_SLACK "%s" has not been posted', message.text)
      })
  } else {
    global.ABIBAO.debuggers.error('BUS_EVENT_WEBHOOK_SLACK has not been used')
  }
}
