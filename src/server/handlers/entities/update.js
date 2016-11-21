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
    params: {
      urn: Joi.string().required()
    },
    payload: {
      name: Joi.string(),
      type: Joi.string().valid(['abibao', 'charity', 'company']),
      contact: Joi.string().email(),
      url: Joi.string(),
      title: Joi.string().allow(''),
      hangs: Joi.string().allow(''),
      description: Joi.string().allow(''),
      usages: Joi.string().allow(''),
      icon: Joi.string().default('images/icons/default.png'),
      avatar: Joi.string().default('images/avatars/default.png'),
      picture: Joi.string().default('images/pictures/default.png')
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
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
