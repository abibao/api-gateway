'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  validate: {
    params: {
      urn: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('query', 'entityReadQuery', request.params.urn)
      .then(function (entity) {
        reply(entity)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
