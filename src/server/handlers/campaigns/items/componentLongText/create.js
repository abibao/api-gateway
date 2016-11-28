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
      // component
      campaign: Joi.string().required(),
      question: Joi.string().required(),
      description: Joi.string().allow(''),
      placeholder: Joi.string().allow(''),
      required: Joi.boolean().required().default(false),
      position: Joi.number().min(0),
      image: Joi.string().allow('').default(''),
      // component specific
      maxLength: Joi.number().required().default(-1),
      // abibao
      label: Joi.string().required(),
      tags: Joi.string()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemLongTextCreateCommand', request.payload)
      .then(function (campaignItem) {
        reply(campaignItem)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
