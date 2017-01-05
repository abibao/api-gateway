'use strict'

var Promise = require('bluebird')

module.exports = function (payload) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    payload.item = self.getIDfromURN(payload.item)
    payload.campaign = self.getIDfromURN(payload.campaign)
    self.execute('command', 'campaignItemChoiceCreateCommand', payload)
      .then(function (choice) {
        return self.execute('query', 'campaignItemChoiceReadQuery', choice.urn)
      })
      .then(resolve)
      .catch(reject)
  })
}
