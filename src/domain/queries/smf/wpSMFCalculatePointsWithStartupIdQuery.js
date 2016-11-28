'use strict'

var Promise = require('bluebird')
var Hoek = require('hoek')

module.exports = function (wpid) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
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
