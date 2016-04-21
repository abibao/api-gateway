'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Ajoute un administrator sur abibao',
  notes: 'Ajoute un administrator sur abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      email: Joi.string().required().email(),
      password1: Joi.string().required(),
      password2: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.server.domain.execute('command', 'administratorRegisterCommand', request.payload).then(function (administrator) {
      reply(administrator)
    })
      .catch(function (error) {
        request.server.logger.error(error)
        reply(Boom.badRequest(error))
      })
  }
}
