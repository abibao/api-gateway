'use strict'

var Promise = require('bluebird')
var Hoek = require('hoek')

module.exports = function (wpid) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  var database = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_DATABASE')
  return new Promise(function (resolve, reject) {
    Promise.props({
      score: self.knex(database + '.smf_votes').sum('points as points').where({startup_id: wpid}),
      name: self.knex(database + '.smf_votes').distinct('startup_name').where({startup_id: wpid})
    }).then(function (result) {
      result.score = result.score[0].points
      result.name = result.name[0].startup_name
      resolve(result)
    }).catch((error) => {
      reject(error)
    })
  })
}
