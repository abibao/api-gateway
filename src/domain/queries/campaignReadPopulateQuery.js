'use strict'

var Promise = require('bluebird')
var uuid = require('node-uuid')
var mapAsync = require('async').map
var _ = require('lodash')

var CURRENT_NAME = 'CampaignReadPopulateQuery'

module.exports = function (urn) {
  var self = this

  return new Promise(function (resolve, reject) {
    try {
      var quid = uuid.v1()
      self.campaignReadQuery(urn).then(function (campaign) {
        return self.entityReadQuery(campaign.urnCompany).then(function (entity) {
          delete campaign.urnCompany
          campaign.company = entity
          self.campaignItemFilterQuery({campaign: self.getIDfromURN(urn)}).then(function (items) {
            mapAsync(items, function (item, next) {
              item.choices = []
              var idItem = self.getIDfromURN(item.urn)
              self.campaignItemChoiceFilterQuery({item: idItem}).then(function (choices) {
                item.choices = _.map(choices, function (choice) {
                  if (_.isUndefined(choice.position)) { choice.position = 0; }
                  delete choice.urnCampaign
                  delete choice.urnItem
                  delete choice.createdAt
                  delete choice.modifiedAt
                  return choice
                })
                if (_.isUndefined(item.position)) { item.position = 0; }
                item.choices = _.orderBy(item.choices, ['position'], ['asc'])
                next()
              })
            }, function () {
              campaign.items = _.orderBy(items, ['position'], ['asc'])
              self.debug.query(CURRENT_NAME, quid)
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
