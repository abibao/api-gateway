'use strict'

var Promise = require('bluebird')

module.exports = function () {
  var self = global.ABIBAO.services.domain
  var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_DATABASES_MYSQSL_ANALYTICS')
  return new Promise(function (resolve, reject) {
    Promise.props({
      scores: self.knex.select('startup_id').sum('points as points').from(database + '.smf_votes').groupBy('startup_id'),
      total: self.knex.sum('points as points').from(database + '.smf_votes')
    }).then(function (result) {
      result.total = result.total[0].points || 0
      resolve(result)
    }).catch((error) => {
      reject(error)
    })
  })
}
