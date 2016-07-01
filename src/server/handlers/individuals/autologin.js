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
    global.ABIBAO.services.domain.execute('command', 'individualLoginWithFingerprintCommand', request.params.fingerprint)
      .then(function (credentials) {
        reply(credentials)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
