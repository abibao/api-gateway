'use strict'

const Promise = require('bluebird')
const errors = require('feathers-errors')
const filter = require('feathers-query-filters')
var _ = require('lodash')

class FindQuerySystem {
  constructor (options) {
    this.options = options
  }
  execute (params) {
    const self = this
    if (self.options === undefined) {
      throw new errors.NotFound('options does not exist')
    }
    // initialize
    const filters = filter(params.query).filters
    const query = filter(params.query).query
    if (filters.$skip === undefined) { filters.$skip = 0 }
    if (filters.$limit === undefined) { filters.$limit = 50 }
    if (filters.$sort === undefined) { filters.$sort = self.options.sort }
    const r = global.ABIBAO.services.domain.rethinkdb.r
    const conn = global.ABIBAO.services.domain.rethinkdb.conn
    let result = {}
    // from urn to id in query
    _.map(self.options.getIDfromURN, function (param) {
      if (query[param]) { query[param] = global.ABIBAO.services.domain.getIDfromURN(query[param]) }
    })
    // execute promise
    return new Promise(function (resolve, reject) {
      r.table(self.options.plurial).filter(query).count().run(conn)
        .then(function (total) {
          result.total = total
          result.skip = filters.$skip
          result.limit = filters.$limit
          return r.table(self.options.plurial).filter(query).orderBy(filters.$sort).skip(filters.$skip).limit(filters.$limit).run(conn)
            .then(function (cursor) {
              result.data = []
              cursor.each(function (err, row) {
                if (err) throw err
                // from urn to id in query
                _.map(self.options.getURNfromID, function (param) {
                  row[param.key] = global.ABIBAO.services.domain.getURNfromID(param.value, row[param.key])
                })
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
}

module.exports = FindQuerySystem
