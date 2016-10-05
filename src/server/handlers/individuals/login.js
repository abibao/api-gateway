'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Authentifie un individu sur abibao',
  notes: 'Authentifie un individu sur abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('command', 'individualLoginWithCredentialsCommand', request.payload)
      .then(function (credentials) {
        reply(credentials)
      })
      .catch(function (error) {
        if (error === 'ERROR_BAD_AUTHENTIFICATION') { return reply(Boom.unauthorized('Email address and/or password invalid')) }
        reply(Boom.badRequest(error))
      })
  }
}
