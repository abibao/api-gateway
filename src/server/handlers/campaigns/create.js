'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute une campagne, affectée à une compagnie donnée',
  notes: 'Ajoute une campagne, affectée à une compagnie donnée',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      urnCompany: Joi.string().required(),
      name: Joi.string().required(),
      position: Joi.number().min(0).default(0),
      screenWelcomeContent: Joi.string().allow(''),
      screenThankYouContent: Joi.string().allow(''),
      price: Joi.number().min(0).required(),
      currency: Joi.string().valid(['EUR']).required(),
      published: Joi.boolean().default(false).required(),
      description: Joi.string()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.server.domain.campaignCreateWithCompanyCommand(request.payload).then(function (campaign) {
      reply(campaign)
    })
      .catch(function (error) {
        request.server.logger.error(error)
        reply(Boom.badRequest(error))
      })
  }
}
