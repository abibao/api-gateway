'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (urn) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      self.execute('query', 'campaignItemReadQuery', urn).then(function (campaignItem) {
        return self.execute('query', 'campaignItemChoiceFilterQuery', {item: self.getIDfromURN(urn)}).then(function (choices) {
          campaignItem.choices = choices
          resolve(campaignItem)
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
