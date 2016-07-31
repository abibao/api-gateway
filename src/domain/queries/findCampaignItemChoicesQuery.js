'use strict'

const FindQueryHandler = require('./../handlers/FindQueryHandler')

module.exports = function (params) {
  let query = new FindQueryHandler({
    plurial: 'campaigns_items_choices',
    singular: 'campaign_item_choice',
    sort: 'label',
    getIDfromURN: [],
    getURNfromID: [
      { key: 'id', value: 'campaign_item_choice' }
    ],
    params: params
  })
  return query.execute(params)
}
