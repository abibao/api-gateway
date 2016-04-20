'use strict'

var Promise = require('bluebird')

module.exports = function (urn) {
  var self = this

  // debugger
  self.debug['query']('[start] %s', 'EntityReadQuery')

  return new Promise(function (resolve, reject) {
    try {
      self.EntityModel.get(self.getIDfromURN(urn)).run().then(function (model) {
        delete model.id
        delete model.company
        delete model.charity
        delete model.campaign
        delete model.item
        self.debug['query']('[finish] %s', 'EntityReadQuery')
        resolve(model)
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
