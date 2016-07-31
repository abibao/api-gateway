'use strict'

const GetQueryHandler = require('./../handlers/GetQueryHandler')

module.exports = function (params) {
  let query = new GetQueryHandler({
    plurial: 'individuals',
    singular: 'individual',
    getIDfromURN: ['urn'],
    getURNfromID: [
      { key: 'id', value: 'individual' },
      { key: 'charity', value: 'entity' },
      { key: 'hasRegisteredEntity', value: 'entity' }
    ],
    populate: [
      { action: 'getEntityDetailsQuery', urn: 'charity' },
      { action: 'getEntityDetailsQuery', urn: 'hasRegisteredEntity' }
    ],
    params: params
  })
  return query.execute(params)
}
