'use strict'

const Promise = require('bluebird')
const Hoek = require('hoek')
const _ = require('lodash')

module.exports = function (urn) {
  const r = global.ABIBAO.services.domain.rethinkdb.r
  const conn = global.ABIBAO.services.domain.rethinkdb.conn
  return new Promise(function (resolve, reject) {
    try {
      var idSurvey = global.ABIBAO.services.domain.getIDfromURN(urn)
      r.table('surveys').get(idSurvey).merge(function (survey) {
        return {
          company: r.table('entities').get(survey('company'))('type'),
          campaign: r.table('campaigns').get(survey('campaign')).merge(function (campaign) {
            return {
              urn: survey('campaign'),
              items: r.table('campaigns_items').filter({campaign: campaign('id')}).orderBy('position').coerceTo('array').merge(function (item) {
                return {
                  urn: item('id'),
                  choices: r.table('campaigns_items_choices').filter({item: item('id')}).orderBy('position').coerceTo('array').merge(function (choice) {
                    return {
                      meta: choice('prefix').add('__').add(choice('suffix')),
                      urn: choice('id')
                    }
                  }).without('id', 'item', 'campaign', 'createdAt', 'modifiedAt')
                }
              }).without('id', 'campaign', 'createdAt', 'modifiedAt')
            }
          }).without('id', 'company', 'price', 'currency', 'createdAt', 'modifiedAt')
        }
      }).without('id', 'charity', 'individual')
        .run(conn)
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
            if (_.isNull(survey.answers)) { survey.answers = {} }
          })
          _.map(survey.campaign.items, function (item) {
            item.urn = global.ABIBAO.services.domain.getURNfromID(item.urn, 'item')
            _.map(item.choices, function (choice) {
              choice.urn = global.ABIBAO.services.domain.getURNfromID(choice.urn, 'choice')
            })
          })
          delete survey.campaign
          delete survey.company
          survey.urn = urn
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
