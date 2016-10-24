'use strict'

var Promise = require('bluebird')

module.exports = function (message) {
  return new Promise(function (resolve) {
    global.ABIBAO.debuggers.bus('BUS_EVENT_SMF_UPDATE_VOTE 1) email=%s', message.email)
    global.ABIBAO.services.domain.execute('command', 'wpSMFUpdateTheVoteCommand', {email: message.email})
  })
}
