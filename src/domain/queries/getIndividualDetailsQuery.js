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
    r.table('individuals').get(query.urn).run(conn)
      .then(function (individual) {
        result = Hoek.clone(individual)
        if (result === null) {
          throw new errors.NotFound('Individual does not exist')
        }
        result.id = global.ABIBAO.services.domain.getURNfromID('individual', individual.id)
        result.charity = global.ABIBAO.services.domain.getURNfromID('entity', individual.charity)
        result.hasRegisteredEntity = global.ABIBAO.services.domain.getURNfromID('entity', individual.hasRegisteredEntity)
        if (filters.$populate !== undefined) {
          return global.ABIBAO.services.domain.execute('query', 'getEntityDetailsQuery', { query: {urn: result.charity} })
            .then(function (charity) {
              result.charity = charity
              return global.ABIBAO.services.domain.execute('query', 'getEntityDetailsQuery', { query: {urn: result.hasRegisteredEntity} })
            })
            .then(function (hasRegisteredEntity) {
              result.hasRegisteredEntity = hasRegisteredEntity
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
