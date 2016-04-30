'use strict'

var nconf = global.ABIBAO.nconf
var Hoek = require('hoek')

module.exports = function (message) {
  var self = Hoek.clone(global.ABIBAO.services.domain)

  // check if campaign is in position (2)
  self.execute('query', 'campaignReadQuery', message.urnCampaign)
    .then(function (campaign) {
      if (campaign.position !== 2) { throw new Error('campaign is not in position (2)') }
      // affect campaign position (3)
      return self.execute('command', 'individualCreateAbibaoSurveyCommand', {target: message.urnIndividual, position: 3})
        .then(function () {
          // get email from individual
          return self.execute('query', 'individualReadQuery', message.urnIndividual)
            .then(function (individual) {
              message.email = individual.email
              // affect campaign position (4)
              return self.execute('command', 'individualCreateAbibaoSurveyCommand', {target: message.urnIndividual, position: 4})
                .then(function () {
                  // informations posted on slack
                  global.ABIBAO.services.bus.publish(global.ABIBAO.events.BusEvent.BUS_EVENT_WEBHOOK_SLACK, {
                    'channel': '#cast-members-only',
                    'username': 'IndividualAutoAffectAbibaoSurveysCommand',
                    'text': '[' + new Date() + '] - [' + individual.email + '] can access abibao surveys (3) and (4)',
                    'webhook': nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
                  })
                  // send email to individual
                  return global.ABIBAO.services.domain.execute('command', 'individualSendEmailAbibaoAffectStep02', message.email)
                    .then(function () {
                      global.ABIBAO.debuggers.bus('BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_STEP02 has been sended to "%s"', message.email)
                    })
                })
            })
        })
    })
    .catch(function (error) {
      global.ABIBAO.debuggers.error('BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_STEP02 has not been sended to "%s" error is %o', message.email, error)
    })
}
