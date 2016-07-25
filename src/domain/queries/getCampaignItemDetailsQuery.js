'use strict'

const Promise = require('bluebird')
const Hoek = require('hoek')
const errors = require('feathers-errors')
const filter = require('feathers-query-filters')

module.exports = function (params) {
  const filters = filter(params.query).filters
  const query = filter(params.query).query
  const r = global.ABIBAO.services.domain.rethinkdb.r
  const conn = global.ABIBAO.services.domain.rethinkdb.conn
  let result = {}
  query.urn = global.ABIBAO.services.domain.getIDfromURN(query.urn)
  return new Promise(function (resolve, reject) {
    r.table('campaigns_items').get(query.urn).run(conn)
      .then(function (campaignItem) {
        result = Hoek.clone(campaignItem)
        if (result === null) {
          throw new errors.NotFound('CampaignItem does not exist')
        }
        result.id = global.ABIBAO.services.domain.getURNfromID('campaign_item', campaignItem.id)
        result.campaign = global.ABIBAO.services.domain.getURNfromID('campaign', campaignItem.campaign)
        if (filters.$populate !== undefined) {
          return global.ABIBAO.services.domain.execute('query', 'getCampaignDetailsQuery', { query: {urn: result.campaign} })
            .then(function (campaign) {
              result.campaign = campaign
              resolve(result)
            })
        } else {
          resolve(result)
        }
      })
      .catch(function (error) {
        if (error.type === 'FeathersError') {
          reject(error)
        } else {
          reject(new errors.GeneralError(error))
        }
      })
  })
}
