'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: "Modifie un composant d'une campagne donnée",
  notes: "Modifie un composant d'une campagne donnée",
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      // component
      question: Joi.string(),
      description: Joi.string().allow(''),
      placeholder: Joi.string().allow(''),
      required: Joi.boolean(),
      image: Joi.string().allow(''),
      position: Joi.number().min(0),
      // componentLongText && componentShortText
      maxLength: Joi.number().description('componentLongText <br> componentShortText'),
      // componentMultipleChoice
      multipleSelections: Joi.boolean().description('componentMultipleChoice'),
      randomize: Joi.boolean().description('componentMultipleChoice'),
      addCustomOption: Joi.boolean().description('componentMultipleChoice'),
      alignment: Joi.string().valid(['vertical', 'horizontal']).description('componentMultipleChoice'),
      // componentNumber
      minimum: Joi.number().description('componentNumber'),
      maximum: Joi.number().description('componentNumber'),
      // abibao
      tags: Joi.string().allow('')
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.payload.urn = request.params.urn
    request.server.domain.campaignItemUpdateCommand(request.payload).then(function (campaignItem) {
      reply(campaignItem)
    })
      .catch(function (error) {
        request.server.logger.error(error)
        reply(Boom.badRequest(error))
      })
  }
}
