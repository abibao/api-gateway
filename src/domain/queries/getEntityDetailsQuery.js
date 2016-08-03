'use strict'

const GetQueryHandler = require('./../handlers/GetQueryHandler')

module.exports = function (params) {
  let query = new GetQueryHandler({
    plurial: 'entities',
    singular: 'entity',
    getIDfromURN: ['urn'],
    getURNfromID: [
      { key: 'id', value: 'entity' }
    ],
    params: params
  })
  return query.execute(params)
}