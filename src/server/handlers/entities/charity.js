'use strict'

var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Retourne toutes les entités de type associations',
  notes: 'Retourne toutes les entités de type associations',
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('query', 'charityRandomListQuery', {type: 'charity'})
      .then(function (entities) {
        reply(entities)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
