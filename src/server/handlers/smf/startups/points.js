'use strict'

var Boom = require('boom')

module.exports = {
  auth: false,
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('query', 'wpSMFCalculatePointsWithStartupIdQuery', request.params.startup)
      .then(function (result) {
        reply(result)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
