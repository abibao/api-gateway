'use strict'

const FindQueryHandler = require('./../handlers/FindQueryHandler')

module.exports = function (params) {
  let query = new FindQueryHandler({
    plurial: 'campaigns',
    singular: 'campaign',
    sort: 'position',
    getIDfromURN: [],
    getURNfromID: [
      { key: 'id', value: 'campaign' },
      { key: 'company', value: 'entity' }
    ],
    params: params
  })
  return query.execute(params)
}
