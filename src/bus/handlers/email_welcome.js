'use strict'

var Hoek = require('hoek')

module.exports = function (message) {
  var self = Hoek.clone(global.ABIBAO.services.domain)

  self.execute('command', 'individualSendEmailWelcomeCommand', message.email)
    .then(function () {
      global.ABIBAO.debuggers.bus('BUS_EVENT_EMAIL_WELCOME has been sended to "%s"', message.email)
    })
    .catch(function () {
      global.ABIBAO.debuggers.error('BUS_EVENT_EMAIL_WELCOME has not been sended to "%s"', message.email)
    })
}
