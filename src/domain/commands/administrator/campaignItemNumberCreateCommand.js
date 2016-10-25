'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    self.execute('query', 'campaignReadQuery', payload.campaign)
      .then(function () {
        payload.campaign = self.getIDfromURN(payload.campaign)
        payload.type = 'ABIBAO_COMPONENT_NUMBER'
        return self.execute('command', 'campaignItemCreateCommand', payload)
          .then(function (campaign) {
            resolve(campaign)
          })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
