'use strict'

var Promise = require('bluebird')

module.exports = function (urn) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    self.EntityModel.get(self.getIDfromURN(urn))
      .then(function (result) {
        return result.delete()
          .then(function (deleted) {
            delete deleted.id
            delete deleted.company
            delete deleted.charity
            delete deleted.campaign
            delete deleted.item
            resolve(deleted)
          })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
