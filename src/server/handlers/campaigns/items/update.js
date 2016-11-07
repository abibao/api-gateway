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
      question: Joi.string(),
      label: Joi.string().allow(''),
      description: Joi.string().allow(''),
      placeholder: Joi.string().allow(''),
      required: Joi.boolean(),
      image: Joi.string().allow(''),
      position: Joi.number().min(0),
      // componentLongText && componentShortText
      maxLength: Joi.number(),
      // componentDropdown && componentMultipleChoice
      addCustomOption: Joi.boolean(),
      addCustomOptionLabel: Joi.string().allow(''),
      addCustomOptionAnswer: Joi.string().allow(''),
      multipleSelections: Joi.boolean(),
      randomize: Joi.boolean(),
      alignment: Joi.string().valid(['vertical', 'horizontal']),
      // componentNumber
      minimum: Joi.number(),
      maximum: Joi.number(),
      // abibao
      tags: Joi.string().allow('')
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    request.payload.urn = request.params.urn
    global.ABIBAO.services.domain.execute('command', 'campaignItemUpdateCommand', request.payload)
      .then(function (campaignItem) {
        reply(campaignItem)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
