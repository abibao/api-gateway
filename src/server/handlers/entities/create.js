'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute une entité au sein de Abibao',
  notes: 'Ajoute une entité au sein de Abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    payload: {
      name: Joi.string().required().description('Le titre qui apparaît dans les listes'),
      type: Joi.string().valid(['abibao', 'charity', 'company']).default('charity').required().description("Type de l'entité"),
      contact: Joi.string().email().required().description('Email du contact'),
      url: Joi.string().default('').required().description("URL du site de l'entité"),
      title: Joi.string().required().description('Le titre qui apparaît sur la fiche détaillée'),
      hangs: Joi.string().required().description('La phrase qui décrit la fiche détaillée'),
      description: Joi.string().required().description('La description (300 caractères)'),
      usages: Joi.string().required().description("Exemples concrêts de l'usage des dons.")
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('command', 'entityCreateCommand', request.payload)
      .then(function (entity) {
        reply(entity)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
