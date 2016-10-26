'use strict'

var Boom = require('boom')

module.exports = {
  auth: false,
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('query', 'wpSMFStartupReadQuery', request.params.wpid)
      .then(function (startup) {
        reply(startup)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
