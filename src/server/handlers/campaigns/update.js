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
    params: {
      urn: Joi.string().required()
    },
    payload: {
      name: Joi.string(),
      position: Joi.number().min(0),
      screenWelcomeContent: Joi.string().allow(''),
      screenThankYouContent: Joi.string().allow(''),
      published: Joi.boolean(),
      description: Joi.string().allow('')
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
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
