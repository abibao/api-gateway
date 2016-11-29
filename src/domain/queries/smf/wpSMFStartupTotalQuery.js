'use strict'

var Promise = require('bluebird')
var Hoek = require('hoek')

module.exports = function () {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  return new Promise(function (resolve, reject) {
    Promise.props({
      scores: self.knex.select('startup_name').sum('points as points').from(database + '.smf_votes').groupBy('startup_name'),
      total: self.knex.sum('points as points').from(database + '.smf_votes')
    }).then(function (result) {
      result.total = result.total[0].points || 0
      resolve(result)
    }).catch((error) => {
      reject(error)
    })
  })
}
