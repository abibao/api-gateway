'use strict'

const GetQueryHandler = require('./../handlers/GetQueryHandler')

module.exports = function (params) {
  let query = new GetQueryHandler({
    plurial: 'campaigns_items',
    singular: 'campaign_item',
    getIDfromURN: ['urn'],
    getURNfromID: [
      { key: 'id', value: 'campaign_item' },
      { key: 'campaign', value: 'campaign' }
    ],
    populate: [
      { action: 'getCampaignDetailsQuery', urn: 'campaign' }
    ],
    params: params
  })
  return query.execute(params)
}
