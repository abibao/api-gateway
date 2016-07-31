'use strict'

const Promise = require('bluebird')
const Hoek = require('hoek')
const _ = require('lodash')
const async = require('async')
const GetQueryHandler = require('./../handlers/GetQueryHandler')

module.exports = function (params) {
  let query = new GetQueryHandler({
    plurial: 'surveys',
    singular: 'survey',
    getIDfromURN: ['urn'],
    getURNfromID: [
      { key: 'id', value: 'individual' },
      { key: 'campaign', value: 'campaign' },
      { key: 'individual', value: 'individual' },
      { key: 'charity', value: 'entity' },
      { key: 'company', value: 'entity' }
    ],
    populate: [
      { action: 'getCampaignDetailsQuery', urn: 'campaign' },
      { action: 'getIndividualDetailsQuery', urn: 'individual' },
      { action: 'getEntityDetailsQuery', urn: 'charity' },
      { action: 'getEntityDetailsQuery', urn: 'company' }
    ],
    params: params
  })
  return new Promise(function (resolve, reject) {
    query.execute(params)
      .then(function (result) {
        let final = Hoek.clone(result)
        let queries = []
        const answers = Object.keys(result.answers)
        _.map(answers, function (key) {
          try {
            const value = global.ABIBAO.services.domain.getURNfromID('campaign_item_choice', result.answers[key])
            queries.push({
              key: key,
              value: { query: {urn: value} }
            })
          } catch(e) {}
        })
        async.mapLimit(queries, 20, function (query, next) {
          global.ABIBAO.services.domain.execute('query', 'getCampaignItemChoiceDetailsQuery', query.value)
            .then(function (choice) {
              final.answers[query.key] = choice
              next()
            })
            .catch(function () {
              if (final.answers[query.key] === 'yes') { final.answers[query.key] = true }
              if (final.answers[query.key] === 'no') { final.answers[query.key] = false }
              if (/^\+?\d+$/.test(final.answers[query.key])) { final.answers[query.key] = Number(final.answers[query.key]) }
              next()
            })
        }, function () {
          resolve(final)
        })
      })
      .catch(reject)
  })
}
