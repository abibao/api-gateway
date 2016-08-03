'use strict'

const FindQueryHandler = require('./../handlers/FindQueryHandler')

module.exports = function (params) {
  let query = new FindQueryHandler({
    plurial: 'campaigns_items',
    singular: 'campaign_item',
    sort: 'position',
    getIDfromURN: ['campaign'],
    getURNfromID: [
      { key: 'id', value: 'campaign_item' },
      { key: 'campaign', value: 'campaign' }
    ],
    params: params
  })
  return query.execute(params)
}