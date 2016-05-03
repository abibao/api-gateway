'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Ajoute un individual sur abibao',
  notes: 'Ajoute un individual sur abibao',
  payload: {
    allow: 'application/x-www-form-urlencoded'
  },
  validate: {
    payload: {
      email: Joi.string().required().email(),
      password1: Joi.string().required(),
      password2: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', request.payload)
      .then(function (individual) {
        reply(individual)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
