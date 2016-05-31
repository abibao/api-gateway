'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('query', 'statsIndividualsGenders', request.payload)
      .then(function (stats) {
        reply(stats)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
