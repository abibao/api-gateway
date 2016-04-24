'use strict'

var Promise = require('bluebird')

module.exports = function (urn) {
  var self = this
  return new Promise(function (resolve, reject) {
    try {
      self.IndividualModel.get(self.getIDfromURN(urn))
        .then(function (result) {
          result.delete().then(resolve)
        })
        .catch(reject)
    } catch (e) {
      reject(e)
    }
  })
}
