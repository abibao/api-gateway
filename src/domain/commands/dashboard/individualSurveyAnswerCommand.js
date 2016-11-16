'use strict'

var Promise = require('bluebird')
var _ = require('lodash')
var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
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
          // next tick on request
          resolve({complete: updated.complete})
          // events on bus
          var regex = /^(urn:abibao:database:)/
          var _answer
          var isURN = false
          if (_.isArray(payload.answer)) {
            _.map(payload.answer, function (item) {
              if (regex.exec(item) !== null) {
                _answer = self.getIDfromURN(item)
                isURN = true
              } else {
                _answer = item
                isURN = false
              }
              global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_COMPUTE_ANSWER, {
                survey: self.getIDfromURN(survey.urn),
                label: payload.label,
                answer: _answer,
                isURN: isURN
              })
            })
          } else {
            if (regex.exec(payload.answer) !== null) {
              _answer = self.getIDfromURN(payload.answer)
              isURN = true
            } else {
              _answer = payload.answer
              isURN = false
            }
            global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_COMPUTE_ANSWER, {
              survey: self.getIDfromURN(survey.urn),
              label: payload.label,
              answer: _answer,
              isURN: isURN
            })
          }
          // auto affectation at the end of abibao survey number 2 ?
          console.log(waterfall.survey)
          if (waterfall.survey.isAbibao === true && waterfall.survey.complete === true && waterfall.survey.position === 2) {
            global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_EMAIL_ABIBAO_AFFECT_CAMPAIGNS_AUTO, {
              urnIndividual: waterfall.survey.urnIndividual,
              urnCampaign: waterfall.survey.urnCampaign,
              urnCharity: waterfall.survey.urnCharity
            })
          }
        })
      })
    })
    .catch(function (error) {
      reject(error)
    })
  })
}
