'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: false,
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    params: {
      fingerprint: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.payload = {
      email: 'a@a.com',
      password: 'a@a.com'
    }
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
