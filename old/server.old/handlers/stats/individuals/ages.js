'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  jsonp: 'callback',
  validate: {
    params: {
      gender: Joi.string().required()
    }
  },
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('query', 'statsIndividualsAges', request.params.gender)
      .then(function (stats) {
        reply(stats)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
