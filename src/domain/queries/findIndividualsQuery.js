'use strict'

const Promise = require('bluebird')
const errors = require('feathers-errors')
const filter = require('feathers-query-filters')

module.exports = function (params) {
  const filters = filter(params.query).filters
  const query = filter(params.query).query
  if (filters.$skip === undefined) { filters.$skip = 0 }
  if (filters.$limit === undefined) { filters.$limit = 50 }
  if (filters.$sort === undefined) { filters.$sort = 'email' }
  const r = global.ABIBAO.services.domain.rethinkdb.r
  const conn = global.ABIBAO.services.domain.rethinkdb.conn
  let result = {}
  if (query.charity) { query.charity = global.ABIBAO.services.domain.getIDfromURN(query.charity) }
  if (query.hasRegisteredEntity) { query.hasRegisteredEntity = global.ABIBAO.services.domain.getIDfromURN(query.hasRegisteredEntity) }
  return new Promise(function (resolve, reject) {
    r.table('individuals').filter(query).count().run(conn)
      .then(function (total) {
        result.total = total
        result.skip = filters.$skip
        result.limit = filters.$limit
        return r.table('individuals').filter(query).orderBy(filters.$sort).skip(filters.$skip).limit(filters.$limit).run(conn)
          .then(function (cursor) {
            result.data = []
            cursor.each(function (err, row) {
              if (err) throw err
              row.id = global.ABIBAO.services.domain.getURNfromID('individual', row.id)
              row.charity = global.ABIBAO.services.domain.getURNfromID('entity', row.charity)
              row.hasRegisteredEntity = global.ABIBAO.services.domain.getURNfromID('entity', row.hasRegisteredEntity)
              result.data.push(row)
            }, function () {
              resolve(result)
            })
          })
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
