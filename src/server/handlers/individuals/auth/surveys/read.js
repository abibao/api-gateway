'use strict'

var Boom = require('boom')
var Joi = require('joi')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  tags: ['api', '1.2) individual'],
  description: 'Retourne les données d\'un sondage',
  notes: 'Retourne les données d\'un sondage',
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    var payload = {
      credentials: request.auth.credentials,
      urn: request.params.urn
    }
    request.server.domain.surveyReadPopulateControlIndividualQuery(payload).then(function (survey) {
      reply(survey)
    })
      .catch(function (error) {
        request.server.logger.error(error)
        reply(Boom.badRequest(error))
      })
  }
}
