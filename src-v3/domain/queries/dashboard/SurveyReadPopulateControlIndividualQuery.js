'use strict'

// libraries
const Promise = require('bluebird')
const _ = require('lodash')

class SurveyReadPopulateControlIndividualQuery {
  constructor (domain) {
    this.type = 'query'
    this.name = 'survey-read-populate-control-individual-query'
    this.nconf = domain.nconf
    this.r = domain.databases.r
    this.domain = domain
  }
  handler (payload) {
    const database = this.nconf.get('ABIBAO_API_GATEWAY_DATABASES_RETHINKDB_MVP')
    return new Promise((resolve, reject) => {
      const idSurvey = this.domain.getIDfromURN(payload.urn)
      this.r.db(database).table('surveys').get(idSurvey).merge((survey) => {
        return {
          company: this.r.db(database).table('entities').get(survey('company'))('type'),
          campaign: this.r.db(database).table('campaigns').get(survey('campaign')).merge((campaign) => {
            return {
              urn: survey('campaign'),
              items: this.r.db(database).table('campaigns_items').filter({campaign: campaign('id')}).orderBy('createdAt').coerceTo('array').merge((item) => {
                return {
                  urn: item('id'),
                  choices: this.r.db(database).table('campaigns_items_choices').filter({item: item('id')}).orderBy('position').coerceTo('array').merge((choice) => {
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
        .then((survey) => {
          survey.name = survey.campaign.name
          survey.screenWelcomeContent = survey.campaign.screenWelcomeContent
          survey.screenThankYouContent = survey.campaign.screenThankYouContent
          if (survey.company === 'company') { survey.fromCompany = true }
          if (survey.company === 'abibao') { survey.fromAbibao = true }
          if (survey.company === 'charity') { survey.fromCharity = true }
          _.map(survey.campaign.items, () => {
            survey.items = survey.campaign.items
            if (_.isUndefined(survey.answers)) { survey.answers = {} }
          })
          _.map(survey.campaign.items, (item) => {
            item.urn = this.domain.getURNfromID('item', item.urn)
            _.map(item.choices, (choice) => {
              choice.urn = this.domain.getURNfromID('choice', choice.urn)
            })
          })
          delete survey.campaign
          delete survey.company
          survey.urn = payload.urn
          resolve(survey)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = SurveyReadPopulateControlIndividualQuery
