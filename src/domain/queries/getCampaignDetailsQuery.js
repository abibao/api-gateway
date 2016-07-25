'use strict'

const Promise = require('bluebird')
const Hoek = require('hoek')
const errors = require('feathers-errors')
const filter = require('feathers-query-filters')

module.exports = function (params) {
  const filters = filter(params.query).filters
  const query = filter(params.query).query
  const r = global.ABIBAO.services.domain.rethinkdb.r
  const conn = global.ABIBAO.services.domain.rethinkdb.conn
  let result = {}
  query.urn = global.ABIBAO.services.domain.getIDfromURN(query.urn)
  return new Promise(function (resolve, reject) {
    r.table('campaigns').get(query.urn).run(conn)
      .then(function (entity) {
        result = Hoek.clone(entity)
        if (result === null) {
          throw new errors.NotFound('Campaign does not exist')
        }
        result.id = global.ABIBAO.services.domain.getURNfromID('campaign', entity.id)
        result.company = global.ABIBAO.services.domain.getURNfromID('entity', entity.company)
        if (filters.$populate !== undefined) {
          return global.ABIBAO.services.domain.execute('query', 'getEntityDetailsQuery', { query: {urn: result.company} })
            .then(function (company) {
              result.company = company
              resolve(result)
            })
        } else {
          resolve(result)
        }
      })
      .catch(function (error) {
        if (error.type === 'FeathersError') {
          reject(error)
        } else {
          reject(new errors.GeneralError(error))
        }
      })
  })
}
