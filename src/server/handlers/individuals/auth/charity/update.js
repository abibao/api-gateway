'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: "Change et historise l'association utilisée par l'utilisateur connecté",
  notes: "Change et historise l'association utilisée par l'utilisateur connecté",
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      charity: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.payload.credentials = request.auth.credentials
    request.server.domain.individualUpdateCharityCommand(request.payload)
      .then(function (individual) {
        reply(individual)
      })
      .catch(function (error) {
        request.server.logger.error(error)
        reply(Boom.badRequest(error))
      })
  }
}
