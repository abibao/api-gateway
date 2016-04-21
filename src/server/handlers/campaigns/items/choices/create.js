'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: "Ajoute un choix pour les items d'une campagnes",
  notes: "Ajoute un choix pour les items d'une campagnes",
  payload: {
    allow: 'application/x-www-form-urlencoded'
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
  handler(request, reply) {
    request.server.domain.execute('command', 'campaignItemChoiceCreateWithCampaignAssignCommand', request.payload).then(function (choice) {
      reply(choice)
    })
      .catch(function (error) {
        request.server.logger.error(error)
        reply(Boom.badRequest(error))
      })
  }
}
