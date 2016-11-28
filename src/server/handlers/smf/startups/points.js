'use strict'

var Boom = require('boom')

module.exports = {
  auth: false,
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('query', 'wpSMFCalculatePointsWithStartupIdQuery', request.params.wpid)
      .then(function (result) {
        reply(result)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
