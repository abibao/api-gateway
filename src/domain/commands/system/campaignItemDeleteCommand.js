'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (urn) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    self.CampaignItemModel.get(self.getIDfromURN(urn))
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
