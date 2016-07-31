'use strict'

const Promise = require('bluebird')
const Hoek = require('hoek')
const errors = require('feathers-errors')
const filter = require('feathers-query-filters')
var _ = require('lodash')

class GetQuerySystem {
  constructor (options) {
    this.options = options
  }
  populate (options, result) {
    return new Promise(function (resolve, reject) {
      global.ABIBAO.services.domain.execute('query', options.action, { query: {urn: result[options.urn]} })
        .then(function (item) {
          result[options.urn] = item
          resolve()
        })
        .catch(reject)
    })
  }
  execute (params) {
    const self = this
    if (self.options === undefined) {
      throw new errors.NotFound('options does not exist')
    }
    // initialize
    const filters = filter(params.query).filters
    const query = filter(params.query).query
    const r = global.ABIBAO.services.domain.rethinkdb.r
    const conn = global.ABIBAO.services.domain.rethinkdb.conn
    let result = {}
    // from urn to id in query
    _.map(self.options.getIDfromURN, function (param) {
      query[param] = global.ABIBAO.services.domain.getIDfromURN(query[param])
    })
    // execute promise
    return new Promise(function (resolve, reject) {
      r.table(self.options.plurial).get(query.urn).run(conn)
        .then(function (item) {
          result = Hoek.clone(item)
          if (result === null) {
            throw new errors.NotFound(self.options.singular + ' does not exist')
          }
          // from urn to id in query
          _.map(self.options.getURNfromID, function (param) {
            result[param.key] = global.ABIBAO.services.domain.getURNfromID(param.value, item[param.key])
          })
          // now populate urns
          if (filters.$populate !== undefined) {
            var populatePromises = []
            _.map(self.options.populate, function (options) {
              populatePromises.push(self.populate(options, result))
            })
            return Promise.all(populatePromises).then(function () {
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
}

module.exports = GetQuerySystem
