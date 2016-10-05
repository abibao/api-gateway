'use strict'

module.exports = {
  auth: false,
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.server.commandHandler(reply, 'wpSMFMakeTheVoteCommand', request.payload)
  }
}
