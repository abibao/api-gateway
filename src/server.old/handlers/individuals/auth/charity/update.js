'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    payload: {
      charity: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.payload.credentials = request.auth.credentials
    global.ABIBAO.services.domain.execute('command', 'individualUpdateCharityCommand', request.payload)
      .then(function (individual) {
        reply(individual)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
