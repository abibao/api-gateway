'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    payload: {
      prefix: Joi.string(),
      suffix: Joi.string(),
      text: Joi.string(),
      position: Joi.number().integer().min(0)
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.payload.urn = request.params.urn
    global.ABIBAO.services.domain.execute('command', 'campaignItemChoiceUpdateCommand', request.payload)
      .then(function (campaignItemChoice) {
        reply(campaignItemChoice)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
