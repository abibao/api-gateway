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
    payload: {
      email: Joi.string().required().email(),
      password1: Joi.string().required(),
      password2: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('command', 'administratorRegisterCommand', request.payload)
      .then(function (administrator) {
        reply(administrator)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
