'use strict'

var Promise = require('bluebird')
var _ = require('lodash')
var VError = require('verror')

module.exports = function (payload) {
  var self = this

  return new Promise(function (resolve, reject) {
    try {
      var waterfall = {}
      waterfall.payload = payload
      return self.execute('query', 'surveyReadQuery', payload.survey).then(function (survey) {
        waterfall.survey = survey
        if (payload.credentials.urn !== waterfall.survey.urnIndividual) { throw new VError('INDIVIDUAL_CONTROL_FAILED') }
        return self.execute('query', 'campaignItemFilterQuery', {campaign: self.getIDfromURN(survey.urnCampaign)}).then(function (items) {
          waterfall.items = items
          if (_.isUndefined(_.find(waterfall.items, {'label': payload.label}))) { throw new VError('ANSWER_CONTROL_FAILED') }
          // add answer
          if (_.isUndefined(waterfall.survey.answers)) { waterfall.survey.answers = {} }
          waterfall.survey.answers[payload.label] = payload.answer
          waterfall.survey.complete = _.keys(waterfall.survey.answers).length === waterfall.items.length
          return self.execute('command', 'surveyUpdateCommand', waterfall.survey).then(function (updated) {
            resolve({complete: updated.complete})
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
