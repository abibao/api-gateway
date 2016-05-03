'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Retourne une campagne donnée',
  notes: 'Retourne une campagne donnée',
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('query', 'campaignReadPopulateQuery', request.params.urn)
      .then(function (campaign) {
        reply(campaign)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
