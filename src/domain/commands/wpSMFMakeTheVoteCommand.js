'use strict'

var Promise = require('bluebird')

module.exports = function (payload) {
  return new Promise(function (resolve, reject) {
    try {
      global.ABIBAO.services.domain.knex('smf_votes')
        .insert({
          email: 'email@email.com'
        })
        .then(function () {
          resolve({created: true})
        })
        .catch(function (error) {
          resolve({created: false, error: error})
        })
    } catch (e) {
      reject(e)
    }
  })
}
