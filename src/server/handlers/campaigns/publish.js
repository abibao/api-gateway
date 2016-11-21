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
    params: {
      urn: Joi.string().required()
    },
    payload: {
      maximum: Joi.number().integer().min(0).required(),
      filter: Joi.string().required(),
      finishedAt: Joi.date()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    request.payload.urn = request.params.urn
    global.ABIBAO.services.domain.execute('command', 'campaignPublishCommand', request.payload)
      .then(function (result) {
        reply(result)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
