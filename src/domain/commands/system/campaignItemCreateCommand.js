'use strict'

var Promise = require('bluebird')
var bson = require('bson')
var ObjectId = bson.ObjectId

module.exports = function (payload) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    payload.id = new ObjectId().toString()
    payload.createdAt = Date.now()
    var model = new self.CampaignItemModel(JSON.parse(JSON.stringify(payload)))
    model.save()
      .then(function (created) {
        delete created.id
        delete created.company
        delete created.charity
        delete created.campaign
        delete created.item
        resolve(created)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
