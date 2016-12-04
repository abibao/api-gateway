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
      email: Joi.string().required().email(),
      password1: Joi.string().required(),
      password2: Joi.string().required(),
      entity: Joi.string(),
      survey: Joi.string(),
      source: Joi.string()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    request.server.methods.command('IndividualRegisterCommand', request.payload)
      .then(function (command) {
        reply(command.result)
      })
      .catch(function (command) {
        reply(Boom.badRequest(command.error))
      })
  }
}
