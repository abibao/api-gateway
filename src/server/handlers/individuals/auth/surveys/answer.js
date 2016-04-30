'use strict'

var Boom = require('boom')
var Joi = require('joi')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Répond à une question d"un sondage donné',
  notes: 'Répond à une question d"un sondage donné',
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    params: {
      urn: Joi.string().required()
    },
    payload: {
      label: Joi.string().required(),
      answer: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    request.payload.survey = request.params.urn
    request.payload.credentials = request.auth.credentials
    global.ABIBAO.services.domain.execute('command', 'individualSurveyAnswerCommand', request.payload)
      .then(function (result) {
        reply(result)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
