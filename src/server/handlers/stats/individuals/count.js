'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  tags: ['api', '1.3) administrator'],
  description: 'Répartition hommes & femmes dans Abibao',
  notes: 'Répartition hommes & femmes dans Abibao',
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('query', 'statsCountGenders', request.payload)
      .then(function (stats) {
        reply(stats)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
