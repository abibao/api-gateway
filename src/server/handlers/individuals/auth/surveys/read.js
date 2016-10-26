'use strict'

var Boom = require('boom')
var Joi = require('joi')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['individual']
  },
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    var payload = {
      credentials: request.auth.credentials,
      urn: request.params.urn
    }
    global.ABIBAO.services.domain.execute('query', 'surveyReadPopulateControlIndividualQuery', payload)
      .then(function (survey) {
        reply(survey)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
