'use strict'

var Promise = require('bluebird')

module.exports = function (urn) {
  var self = this
  return new Promise(function (resolve, reject) {
    try {
      self.CampaignItemChoiceModel.get(self.getIDfromURN(urn))
      .then(function (model) {
        return model.delete()
          .then(function (result) {
            resolve()
          })
      })
    } catch (e) {
      reject(e)
    }
  })
}
