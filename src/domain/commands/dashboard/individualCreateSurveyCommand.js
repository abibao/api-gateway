'use strict'

var Promise = require('bluebird')

module.exports = function (data) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    // promises: constructor
    var promises = {
      campaign: self.execute('query', 'campaignReadQuery', data.campaign),
      individual: self.execute('query', 'individualReadQuery', data.individual),
      charity: self.execute('query', 'entityReadQuery', data.charity)
    }
    // promises: resolve
    Promise.props(promises)
      .then((result) => {
        var data = {
          campaign: self.getIDfromURN(result.campaign.urn),
          company: self.getIDfromURN(result.campaign.urnCompany),
          charity: self.getIDfromURN(result.charity.urn),
          individual: self.getIDfromURN(result.individual.urn),
          answers: {}
        }
        var message = {
          'username': 'individualCreateSurveyCommand',
          'text': '[' + new Date() + '] - [' + result.individual.email + '] can access a new survey (' + result.campaign.name + ')',
          'webhook': global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
        }
        return self.execute('query', 'surveyFilterQuery', {
          campaign: self.getIDfromURN(result.campaign.urn),
          individual: self.getIDfromURN(result.individual.urn)
        }).then((surveys) => {
          if (surveys.length === 0) {
            return self.execute('command', 'surveyCreateCommand', data)
              .then(() => {
                resolve({created: true})
                // informations posted on slack
                global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_WEBHOOK_SLACK, message)
              })
          } else {
            resolve({created: true})
          }
        })
      })
      .catch(reject)
  })
}
