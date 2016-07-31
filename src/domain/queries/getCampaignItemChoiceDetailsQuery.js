'use strict'

const GetQueryHandler = require('./../handlers/GetQueryHandler')

module.exports = function (params) {
  let query = new GetQueryHandler({
    plurial: 'campaigns_items_choices',
    singular: 'campaign_item_choice',
    getIDfromURN: ['urn'],
    getURNfromID: [],
    populate: [],
    params: params
  })
  return query.execute(params)
}
