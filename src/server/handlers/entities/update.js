'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Modifie une entité au sein de Abibao',
  notes: 'Modifie une entité au sein de Abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      name: Joi.string().description('Le titre qui apparaît dans les listes'),
      type: Joi.string().valid(['abibao', 'charity', 'company']).description("Type de l'entité"),
      contact: Joi.string().email().description('Email du contact'),
      url: Joi.string().description("URL du site de l'entité"),
      title: Joi.string().allow('').description('Le titre qui apparaît sur la fiche détaillée'),
      hangs: Joi.string().allow('').description('La phrase qui décrit la fiche détaillée'),
      description: Joi.string().allow('').description('La description (300 caractères)'),
      usages: Joi.string().allow('').description("Exemples concrêts de l'usage des dons."),
      icon: Joi.string().default('images/icons/default.png'),
      avatar: Joi.string().default('images/avatars/default.png'),
      picture: Joi.string().default('images/pictures/default.png')
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.payload.urn = request.params.urn
    global.ABIBAO.services.domain.execute('command', 'entityUpdateCommand', request.payload)
      .then(function (entity) {
        reply(entity)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
