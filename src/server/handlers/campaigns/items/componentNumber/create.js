'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute un composant LongText à un sondage donné',
  notes: 'Ajoute un composant LongText à un sondage donné',
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    payload: {
      // component
      campaign: Joi.string().required(),
      question: Joi.string().required(),
      description: Joi.string(),
      placeholder: Joi.string().allow(''),
      required: Joi.boolean().required().default(false),
      image: Joi.string().default(''),
      // component specific
      minimum: Joi.number().required().default(0),
      maximum: Joi.number().required().default(0),
      // abibao
      label: Joi.string().required().description('Le nom de la variable où sera stockée la réponse'),
      tags: Joi.string()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemNumberCreateCommand', request.payload)
      .then(function (campaignItem) {
        reply(campaignItem)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
