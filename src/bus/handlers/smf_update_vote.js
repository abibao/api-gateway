'use strict'

var Promise = require('bluebird')

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    global.ABIBAO.debuggers.bus('BUS_EVENT_SMF_UPDATE_VOTE email=%s', message.email)
    global.ABIBAO.services.domain.execute('command', 'wpSMFUpdateTheVoteCommand', {email: message.email})
      .then(resolve)
      .catch(reject)
  })
}
