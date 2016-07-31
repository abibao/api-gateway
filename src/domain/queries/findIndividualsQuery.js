'use strict'

const FindQueryHandler = require('./../handlers/FindQueryHandler')

module.exports = function (params) {
  let query = new FindQueryHandler({
    plurial: 'individuals',
    singular: 'individual',
    sort: 'email',
    getIDfromURN: ['charity', 'hasRegisteredEntity'],
    getURNfromID: [
      { key: 'id', value: 'individual' },
      { key: 'charity', value: 'entity' },
      { key: 'hasRegisteredEntity', value: 'entity' }
    ],
    params: params
  })
  return query.execute(params)
}
