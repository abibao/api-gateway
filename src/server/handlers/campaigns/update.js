'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Modifie une campagne au sein de Abibao',
  notes: 'Modifie une campagne au sein de Abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      name: Joi.string(),
      position: Joi.number().min(0),
      screenWelcomeContent: Joi.string().allow(''),
      screenThankYouContent: Joi.string().allow(''),
      price: Joi.number().min(0),
      currency: Joi.string().valid(['EUR']),
      published: Joi.boolean(),
      description: Joi.string().allow('')
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.payload.urn = request.params.urn
    global.ABIBAO.services.domain.execute('command', 'campaignUpdateCommand', request.payload)
      .then(function (campaign) {
        reply(campaign)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
