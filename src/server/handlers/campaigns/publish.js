'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Publie une campagne pour un filtre d"individus donné',
  notes: 'Publie une campagne pour un filtre d"individus donné',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    params: {
      urn: Joi.string().required(),
    },
    payload: {
      maximum: Joi.number().integer().min(0).required(),
      filter: Joi.string().required(),
      finishedAt: Joi.date().format('DD/MM/YYYY'),
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.payload.urn = request.params.urn
    request.server.domain.campaignPublishCommand(request.payload).then(function (result) {
      reply(result)
    })
      .catch(function (error) {
        request.server.logger.error(error)
        reply(Boom.badRequest(error))
      })
  }
}
