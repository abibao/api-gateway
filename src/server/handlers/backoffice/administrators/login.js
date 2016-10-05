'use strict'

var Joi = require('joi')

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
  handler (request, reply) {
    global.ABIBAO.services.server.commandHandler(reply, 'administratorLoginWithCredentialsCommand', request.payload)
  }
}
