'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  payload: {
    allow: ['application/x-www-form-urlencoded', 'application/json']
  },
  validate: {
    payload: {
      item: Joi.string().required(),
      campaign: Joi.string().required(),
      prefix: Joi.string(),
      suffix: Joi.string(),
      text: Joi.string().required(),
      position: Joi.number().integer().min(0).default(0).required()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemChoiceCreateWithCampaignAssignCommand', request.payload)
      .then(function (choice) {
        reply(choice)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
