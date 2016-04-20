'use strict'

var Promise = require('bluebird')

module.exports = function (payload) {
  var self = this
  return new Promise(function (resolve, reject) {
    try {
      payload.company = self.getIDfromURN(payload.urnCompany)
      self.execute('command', 'campaignCreateCommand', payload).then(function (campaign) {
        resolve(campaign)
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
