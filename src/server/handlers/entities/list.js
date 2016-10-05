'use strict'

var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('query', 'entityFilterQuery', {})
      .then(function (entities) {
        reply(entities)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
