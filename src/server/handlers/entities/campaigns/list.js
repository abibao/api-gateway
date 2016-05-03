'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Retourne la liste des campagnes d"une entité donnée',
  notes: 'Retourne la liste des campagnes d"une entité donnée',
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('query', 'entityListCampaignsQuery', request.params.urn)
      .then(function (campaigns) {
        reply(campaigns)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
