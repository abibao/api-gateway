'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (urn) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      self.CampaignModel.get(self.getIDfromURN(urn))
        .then(function (result) {
          result.delete().then(resolve)
        })
        .catch(reject)
    } catch (e) {
      reject(e)
    }
  })
}
