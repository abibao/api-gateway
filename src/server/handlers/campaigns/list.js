'use strict'

var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Retourne toutes les campagnes',
  notes: 'Retourne toutes les campagnes',
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
