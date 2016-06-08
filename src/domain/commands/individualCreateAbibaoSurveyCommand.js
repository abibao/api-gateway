'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (data) {
  var nconf = global.ABIBAO.nconf
  var domain = Hoek.clone(global.ABIBAO.services.domain)

  var target = data.target
  var position = data.position
  var email = data.email

  return new Promise(function (resolve, reject) {
    try {
      // get abibao entity
      domain.execute('query', 'entityFilterQuery', {type: 'abibao'}).then(function (entities) {
        var entity = entities[0]
        entity.id = domain.getIDfromURN(entity.urn)
        // get the campaign with the requested position
        return domain.execute('query', 'campaignFilterQuery', {company: entity.id, position: position}).then(function (campaigns) {
          // control is individual as this campaign already affected
          var campaign = campaigns[0]
          return domain.execute('query', 'surveyFilterQuery', {individual: domain.getIDfromURN(target), campaign: domain.getIDfromURN(campaign.urn)})
            .then(function (surveys) {
              if (surveys.length !== 0) { return resolve() }
              // ok so we continue
              var data = {
                campaign: domain.getIDfromURN(campaign.urn),
                company: domain.getIDfromURN(campaign.urnCompany),
                charity: domain.getIDfromURN(campaign.urnCompany),
                individual: domain.getIDfromURN(target),
                answers: {}
              }
              // create the new survey
              return domain.execute('command', 'surveyCreateCommand', data).then(function () {
                // informations posted on slack
                global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_WEBHOOK_SLACK, {
                  'channel': '#cast-members-only',
                  'username': 'IndividualCreateAbibaoSurveyCommand',
                  'text': '[' + new Date() + '] - [' + email + '] can access abibao surveys (' + position + ')',
                  'webhook': nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
                })
                resolve()
              })
            })
        })
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
