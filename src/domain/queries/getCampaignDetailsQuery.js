'use strict'

const GetQueryHandler = require('./../handlers/GetQueryHandler')

module.exports = function (params) {
  let query = new GetQueryHandler({
    plurial: 'campaigns',
    singular: 'campaign',
    getIDfromURN: ['urn'],
    getURNfromID: [
      { key: 'id', value: 'campaign' },
      { key: 'company', value: 'entity' }
    ],
    populate: [
      { action: 'getEntityDetailsQuery', urn: 'company' }
    ],
    params: params
  })
  return query.execute(params)
}
