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
      // component
      campaign: Joi.string().required(),
      question: Joi.string().required(),
      description: Joi.string(),
      required: Joi.boolean().required().default(false),
      position: Joi.number().min(0),
      image: Joi.string().default(''),
      // component specific
      multipleSelections: Joi.boolean().required().default(false),
      randomize: Joi.boolean().required().default(false),
      addCustomOption: Joi.boolean().required().default(false),
      addCustomOptionLabel: Joi.string().allow(''),
      alignment: Joi.string().valid(['vertical', 'horizontal']).required().default('horizontal'),
      // abibao
      label: Joi.string().required(),
      tags: Joi.string()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemMultipleChoiceCreateCommand', request.payload)
      .then(function (campaignItem) {
        reply(campaignItem)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
