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
    global.ABIBAO.services.domain.execute('query', 'entityListCampaignsQuery', request.params.urn)
      .then(function (campaigns) {
        reply(campaigns)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
