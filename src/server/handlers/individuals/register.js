'use strict'

var Joi = require('joi')
var Boom = require('boom')

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
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', request.payload)
      .then(function (individual) {
        reply(individual)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
