'use strict'

const Boom = require('boom')
const Joi = require('joi')

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
    const payload = {
      credentials: request.auth.credentials,
      urn: request.params.urn
    }
    request.server.methods.query('SurveyReadPopulateControlIndividualQuery', payload)
      .then((query) => {
        reply(query.result)
      })
      .catch((query) => {
        reply(Boom.badRequest(query.error))
      })
  }
}
