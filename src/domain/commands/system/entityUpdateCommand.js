'use strict'

var Promise = require('bluebird')

module.exports = function (payload) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    self.EntityModel.get(self.getIDfromURN(payload.urn)).run()
      .then(function (model) {
        return model.merge(payload).save().then(function (updated) {
          delete updated.id
          delete updated.company
          delete updated.charity
          delete updated.campaign
          delete updated.item
          resolve(updated)
        })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
