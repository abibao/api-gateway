'use strict'

var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function (payload) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    try {
      var idSurvey = self.getIDfromURN(payload.urn)
      self.thinky.r.table('surveys').get(idSurvey).merge(function (survey) {
        return {
          company: self.thinky.r.table('entities').get(survey('company'))('type'),
          campaign: self.thinky.r.table('campaigns').get(survey('campaign')).merge(function (campaign) {
            return {
              urn: survey('campaign'),
              items: self.thinky.r.table('campaigns_items').filter({campaign: campaign('id')}).orderBy('createdAt').coerceTo('array').merge(function (item) {
                return {
                  urn: item('id'),
                  choices: self.thinky.r.table('campaigns_items_choices').filter({item: item('id')}).orderBy('position').coerceTo('array').merge(function (choice) {
                    return {
                      meta: choice('prefix').add('__').add(choice('suffix')),
                      urn: choice('id')
                    }
                  }).without('id', 'item', 'campaign', 'createdAt', 'modifiedAt')
                }
              }).without('id', 'campaign', 'createdAt', 'modifiedAt')
            }
          }).without('id', 'company', 'createdAt', 'modifiedAt')
        }
      }).without('id', 'charity', 'individual')
        .then(function (survey) {
          survey.name = survey.campaign.name
          survey.screenWelcomeContent = survey.campaign.screenWelcomeContent
          survey.screenThankYouContent = survey.campaign.screenThankYouContent
          if (survey.company === global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_COMPANY) { survey.fromCompany = true }
          if (survey.company === global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_ABIBAO) { survey.fromAbibao = true }
          if (survey.company === global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_CHARITY) { survey.fromCharity = true }
          _.map(survey.campaign.items, function () {
            survey.items = survey.campaign.items
            if (_.isUndefined(survey.answers)) { survey.answers = {} }
          })
          _.map(survey.campaign.items, function (item) {
            item.urn = self.getURNfromID(item.urn, 'item')
            _.map(item.choices, function (choice) {
              choice.urn = self.getURNfromID(choice.urn, 'choice')
            })
          })
          delete survey.campaign
          delete survey.company
          survey.urn = payload.urn
          resolve(survey)
        })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
