'use strict'

var Promise = require('bluebird')

module.exports = function (data) {
  var target = data.target
  var position = data.position
  var email = data.email
  var self = global.ABIBAO.services.domain
  var nconf = global.ABIBAO.nconf
  return new Promise(function (resolve, reject) {
    // get abibao entity
    self.execute('query', 'entityFilterQuery', {type: 'abibao'})
      .then(function (entities) {
        var entity = entities[0]
        entity.id = self.getIDfromURN(entity.urn)
        // get the campaign with the requested position
        return self.execute('query', 'campaignFilterQuery', {company: entity.id, position}).then(function (campaigns) {
          // control is individual as this campaign already affected
          var campaign = campaigns[0]
          return self.execute('query', 'surveyFilterQuery', {individual: self.getIDfromURN(target), campaign: self.getIDfromURN(campaign.urn)})
            .then(function (surveys) {
              if (surveys.length !== 0) { return resolve() }
              // ok so we continue
              var data = {
                campaign: self.getIDfromURN(campaign.urn),
                company: self.getIDfromURN(campaign.urnCompany),
                charity: self.getIDfromURN(campaign.urnCompany),
                individual: self.getIDfromURN(target),
                answers: {}
              }
              // create the new survey
              return self.execute('command', 'surveyCreateCommand', data)
                .then(function () {
                  resolve()
                  // informations posted on slack
                  global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_WEBHOOK_SLACK, {
                    'username': 'IndividualCreateAbibaoSurveyCommand',
                    'text': '[' + new Date() + '] - [' + email + '] can access abibao surveys (' + position + ')',
                    'webhook': nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
                  })
                })
            })
        })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
