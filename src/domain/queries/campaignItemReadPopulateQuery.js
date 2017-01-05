'use strict'

var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function (urn) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    self.execute('query', 'campaignItemReadQuery', urn).then(function (campaignItem) {
      return self.execute('query', 'campaignItemChoiceFilterQuery', {item: self.getIDfromURN(urn)}).then(function (choices) {
        campaignItem.choices = _.orderBy(choices, ['position'], ['asc'])
        resolve(campaignItem)
      })
    }).catch(function (error) {
      reject(error)
    })
  })
}
