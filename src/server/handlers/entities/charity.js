'use strict'

var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('query', 'charityRandomListQuery', {type: 'charity'})
      .then(function (entities) {
        reply(entities)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
