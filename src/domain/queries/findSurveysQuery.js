'use strict'

const FindQueryHandler = require('./../handlers/FindQueryHandler')

module.exports = function (params) {
  let query = new FindQueryHandler({
    plurial: 'surveys',
    singular: 'survey',
    sort: 'createdAt',
    getIDfromURN: ['campaign', 'individual', 'charity', 'company'],
    getURNfromID: [
      { key: 'id', value: 'survey' },
      { key: 'campaign', value: 'campaign' },
      { key: 'individual', value: 'individual' },
      { key: 'charity', value: 'entity' },
      { key: 'company', value: 'entity' }
    ],
    params: params
  })
  return query.execute(params)
}
