'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (data) {
  var self = Hoek.clone(global.ABIBAO.services.domain)

  var target = data.target
  var position = data.position

  return new Promise(function (resolve, reject) {
    try {
      // get abibao entity
      self.execute('query', 'entityFilterQuery', {type: 'abibao'}).then(function (entities) {
        var entity = entities[0]
        entity.id = self.getIDfromURN(entity.urn)
        // get the campaign with the requested position
        return self.execute('query', 'campaignFilterQuery', {company: entity.id, position: position}).then(function (campaigns) {
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
              return self.execute('query', 'surveyCreateCommand', data).then(function (survey) {
                var payload = {
                  urn: survey.urn,
                  credentials: {
                    urn: target
                  }
                }
                // return the new survey populate
                return self.execute('query', 'surveyReadPopulateControlIndividualQuery', payload).then(function () {
                  resolve()
                })
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
