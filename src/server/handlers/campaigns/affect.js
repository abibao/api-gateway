'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: {
    strategy: 'jwt',
    scope: ['administrator']
  },
  payload: {
    allow: ['application/x-www-form-urlencoded', 'application/json']
  },
  validate: {
    payload: {
      email: Joi.string().email().required()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    request.payload.campaign = request.params.urn
    global.ABIBAO.services.domain.execute('command', 'individualSendEmailAffectCampaignsAuto', request.payload)
      .then(function (campaign) {
        reply(campaign)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
