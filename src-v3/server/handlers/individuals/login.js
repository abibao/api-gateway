'use strict'

var Joi = require('joi')

module.exports = {
  auth: false,
  payload: {
    allow: ['application/x-www-form-urlencoded', 'application/json']
  },
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    request.server.methods.query('IndividualLoginWithCredentialsCommand', request.payload)
      .then(function (credentials) {
        reply(credentials)
      })
      .catch(function (error) {
        const Boom = request.server.methods.modules.get('boom')
        if (error === 'ERROR_BAD_AUTHENTIFICATION') { return reply(Boom.unauthorized('Email address and/or password invalid')) }
        reply(Boom.badRequest(error))
      })
  }
}
