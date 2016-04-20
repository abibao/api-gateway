'use strict'

var Promise = require('bluebird')

module.exports = function (data) {
  var self = this

  var target = data.target
  var position = data.position

  return new Promise(function (resolve, reject) {
    try {
      self.execute('query', 'entityFilterQuery', {type: 'abibao'}).then(function (entities) {
        var entity = entities[0]
        entity.id = self.getIDfromURN(entity.urn)
        return self.execute('query', 'campaignFilterQuery', {company: entity.id, position: position}).then(function (campaigns) {
          var campaign = campaigns[0]
          var data = {
            campaign: self.getIDfromURN(campaign.urn),
            company: self.getIDfromURN(campaign.urnCompany),
            charity: self.getIDfromURN(campaign.urnCompany),
            individual: self.getIDfromURN(target),
            answers: {}
          }
          return self.execute('query', 'surveyCreateCommand', data).then(function (survey) {
            var payload = {
              urn: survey.urn,
              credentials: {
                urn: target
              }
            }
            return self.execute('query', 'surveyReadPopulateControlIndividualQuery', payload).then(function () {
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
