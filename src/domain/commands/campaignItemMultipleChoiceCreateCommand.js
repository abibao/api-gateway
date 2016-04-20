'use strict'

var Promise = require('bluebird')

module.exports = function (payload) {
  var self = this
  return new Promise(function (resolve, reject) {
    try {
      self.execute('query', 'campaignReadQuery', payload.campaign).then(function () {
        payload.campaign = self.getIDfromURN(payload.campaign)
        payload.type = 'ABIBAO_COMPONENT_MULTIPLE_CHOICE'
        return self.execute('command', 'campaignItemCreateCommand', payload).then(function (campaign) {
          resolve(campaign)
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
