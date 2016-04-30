'use strict'

var Promise = require('bluebird')
var _ = require('lodash')
var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)

  return new Promise(function (resolve, reject) {
    try {
      var waterfall = {}
      waterfall.payload = payload
      return self.execute('query', 'surveyReadWithAbibaoChecksQuery', payload.survey).then(function (survey) {
        waterfall.survey = survey
        if (payload.credentials.urn !== waterfall.survey.urnIndividual) { throw new Error('INDIVIDUAL_CONTROL_FAILED') }
        return self.execute('query', 'campaignItemFilterQuery', {campaign: self.getIDfromURN(survey.urnCampaign)}).then(function (items) {
          waterfall.items = items
          if (_.isUndefined(_.find(waterfall.items, {'label': payload.label}))) { throw new Error('ANSWER_CONTROL_FAILED') }
          // add answer
          if (_.isUndefined(waterfall.survey.answers)) { waterfall.survey.answers = {} }
          waterfall.survey.answers[payload.label] = survey.formatAnswer(survey.type, payload.answer)
          waterfall.survey.complete = _.keys(waterfall.survey.answers).length === waterfall.items.length
          return self.execute('command', 'surveyUpdateCommand', waterfall.survey).then(function (updated) {
            if (waterfall.survey.isAbibao === true && waterfall.survey.complete === true) {
              // send email
              global.ABIBAO.services.bus.publish(global.ABIBAO.events.BusEvent.BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_STEP02, {
                urnIndividual: waterfall.survey.urnIndividual,
                urnCampaign: waterfall.survey.urnCampaign
              })
            }
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
