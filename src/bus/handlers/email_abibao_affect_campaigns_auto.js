'use strict'

var Hoek = require('hoek')

module.exports = function (message) {
  var self = Hoek.clone(global.ABIBAO.services.domain)

  // check if campaign is in position (2)
  self.execute('query', 'campaignReadQuery', message.urnCampaign)
    .then(function (campaign) {
      if (campaign.position !== 2) { throw new Error('campaign is not in position (2)') }
      // get email from individual
      return self.execute('query', 'individualReadQuery', message.urnIndividual)
        .then(function (individual) {
          message.email = individual.email
          return self.execute('command', 'individualSendEmailAbibaoAffectCampaignsAuto', {
            email: individual.email,
            urnIndividual: individual.urn,
            urnCharity: message.urnCharity,
            urnCompany: message.urnCompany
          })
            .then(function () {
              global.ABIBAO.debuggers.bus('BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_AUTO has been sended to "%s"', message.email)
            })
        })
    })
    .catch(function (error) {
      global.ABIBAO.debuggers.error('BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_AUTO has not been sended to "%s" error is %o', message.email, error)
    })
}
