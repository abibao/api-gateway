'use strict'

var Promise = require('bluebird')

module.exports = function (urn) {
  var self = this
  return new Promise(function (resolve, reject) {
    try {
      self.SurveyModel.get(self.getIDfromURN(urn)).run().then(function (model) {
        return model.delete().then(function () {
          resolve({deleted: true})
        })
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
