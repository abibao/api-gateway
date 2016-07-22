'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')
var mapAsync = require('async').map
var _ = require('lodash')

module.exports = function (urn) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      self.execute('query', 'campaignReadQuery', urn).then(function (campaign) {
        return self.execute('query', 'entityReadQuery', campaign.urnCompany).then(function (entity) {
          delete campaign.urnCompany
          campaign.company = entity
          self.execute('query', 'campaignItemFilterQuery', {campaign: self.getIDfromURN(urn)}).then(function (items) {
            mapAsync(items, function (item, next) {
              item.choices = []
              var idItem = self.getIDfromURN(item.urn)
              self.execute('query', 'campaignItemChoiceFilterQuery', {item: idItem}).then(function (choices) {
                item.choices = _.map(choices, function (choice) {
                  if (_.isUndefined(choice.position)) { choice.position = 0 }
                  delete choice.urnCampaign
                  delete choice.urnItem
                  delete choice.createdAt
                  delete choice.modifiedAt
                  return choice
                })
                if (_.isUndefined(item.position)) { item.position = 0 }
                item.choices = _.orderBy(item.choices, ['position'], ['asc'])
                next()
              })
            }, function () {
              campaign.items = _.orderBy(items, ['position'], ['asc'])
              resolve(campaign)
            })
          })
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
