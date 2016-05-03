'use strict'

var Joi = require('joi')
var Boom = require('boom')

module.exports = {
  auth: false,
  tags: ['api', '1.1) not authentified'],
  description: 'Affecte une campagne à un utilisateur',
  notes: 'Affecte une campagne à un utilisateur',
  validate: {
    params: {
      sealed: Joi.string().required()
    }
  },
  jsonp: 'callback',
  handler(request, reply) {
    global.ABIBAO.services.domain.execute('command', 'individualAssignCampaignAbibaoAutoCommand', request.params.sealed)
      .then(function (result) {
        reply.redirect(global.ABIBAO.nconf.get('ABIBAO_WEB_DASHBOARD_URI'))
      })
      .catch(function (error) {
        reply(Boom.badRequest(error))
      })
  }
}
