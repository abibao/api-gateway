'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: false,
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
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('command', 'administratorLoginWithCredentialsCommand', request.payload)
      .then(function (credentials) {
        reply(credentials)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
