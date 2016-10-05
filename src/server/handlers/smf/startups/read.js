'use strict'

module.exports = {
  auth: false,
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.server.queryHandler(reply, 'wpSMFStartupReadQuery', request.params.wpid)
  }
}
