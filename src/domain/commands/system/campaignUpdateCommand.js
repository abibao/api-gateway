'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      self.CampaignModel.get(self.getIDfromURN(payload.urn)).run().then(function (model) {
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
    } catch (e) {
      reject(e)
    }
  })
}
