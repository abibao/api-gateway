'use strict'

// libraries
const Boom = require('boom')
const Joi = require('joi')

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
    request.server.methods.command('IndividualLoginWithCredentialsCommand', request.payload)
      .then((command) => {
        reply(command.result)
      })
      .catch((command) => {
        if (command.error === 'ERROR_BAD_AUTHENTIFICATION') { return reply(Boom.unauthorized('Email address and/or password invalid')) }
        reply(Boom.badRequest(command.error))
      })
  }
}
