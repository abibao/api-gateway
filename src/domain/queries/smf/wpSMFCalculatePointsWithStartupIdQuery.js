'use strict'

var Promise = require('bluebird')

module.exports = function (wpid) {
  var self = global.ABIBAO.services.domain
  var database = global.ABIBAO.config('ABIBAO_API_GATEWAY_POSTGRES_DATABASE')
  return new Promise(function (resolve, reject) {
    Promise.props({
      score: self.knex(database + '.smf_votes').sum('points as points').where({startup_id: wpid}),
      startup: self.execute('query', 'wpSMFStartupReadQuery', wpid)
    }).then(function (result) {
      result.startup.score = result.score[0].points
      resolve(result.startup)
    }).catch((error) => {
      reject(error)
    })
  })
}
