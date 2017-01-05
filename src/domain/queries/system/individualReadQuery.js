'use strict'

var Promise = require('bluebird')

module.exports = function (urn) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    self.IndividualModel.get(self.getIDfromURN(urn)).run()
      .then(function (model) {
        delete model.id
        delete model.company
        delete model.charity
        delete model.campaign
        delete model.item
        delete model.hasRegisteredEntity
        delete model.hasRegisteredSurvey
        resolve(model)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
