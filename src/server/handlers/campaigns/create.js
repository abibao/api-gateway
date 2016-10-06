'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  payload: {
    allow: 'application/x-www-form-urlencoded'
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
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('command', 'campaignCreateWithCompanyCommand', request.payload)
      .then(function (campaign) {
        reply(campaign)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
