'use strict'

var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('query', 'campaignFilterQuery', {})
      .then(function (campaigns) {
        reply(campaigns)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
