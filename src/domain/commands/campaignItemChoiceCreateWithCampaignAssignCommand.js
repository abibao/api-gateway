'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    payload.item = self.getIDfromURN(payload.item)
    payload.campaign = self.getIDfromURN(payload.campaign)
    self.execute('command', 'campaignItemChoiceCreateCommand', payload)
      .then(function (choice) {
        return self.execute('query', 'campaignItemChoiceReadQuery', choice.urn)
          .then(function (choice) {
            resolve(choice)
          })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
