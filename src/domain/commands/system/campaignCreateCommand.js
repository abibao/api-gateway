'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      payload.id = new ObjectId().toString()
      payload.createdAt = Date.now()
      var model = new self.CampaignModel(payload)
      model.save().then(function (created) {
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
    } catch (e) {
      reject(e)
    }
  })
}
