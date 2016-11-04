'use strict'

module.exports = function (message) {
  global.ABIBAO.debuggers.bus('BUS_EVENT_SMF_UPDATE_VOTE message=%o', message)
  global.ABIBAO.services.domain.execute('command', 'wpSMFUpdateTheVoteCommand', {email: message.email})
}
