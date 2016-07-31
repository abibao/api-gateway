'use strict'

const FindQueryHandler = require('./../handlers/FindQueryHandler')

module.exports = function (params) {
  let query = new FindQueryHandler({
    plurial: 'entities',
    singular: 'entity',
    sort: 'position',
    getIDfromURN: [],
    getURNfromID: [
      { key: 'id', value: 'entity' }
    ],
    params: params
  })
  return query.execute(params)
}
