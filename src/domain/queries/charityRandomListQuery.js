'use strict'

var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function () {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    try {
      self.execute('query', 'entityFilterQuery', {type: 'charity'}).then(function (entities) {
        resolve(_.shuffle(entities))
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
