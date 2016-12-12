'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: false,
  validate: {
    params: {
      sealed: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler (request, reply) {
    global.ABIBAO.services.domain.execute('command', 'individualAssignCampaignAutoCommand', request.params.sealed)
      .then(function (result) {
        reply.redirect(global.ABIBAO.nconf.get('ABIBAO_WEB_DASHBOARD_URI') + '/login?fingerprint=' + result.fingerprint)
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
