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
      name: Joi.string().required(),
      type: Joi.string().valid(['abibao', 'charity', 'company']).default('charity').required(),
      contact: Joi.string().email().required(),
      url: Joi.string().default('').required(),
      title: Joi.string().required(),
      hangs: Joi.string().required(),
      description: Joi.string().required(),
      usages: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('command', 'entityCreateCommand', request.payload)
      .then(function (entity) {
        reply(entity)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
