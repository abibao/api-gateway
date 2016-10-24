'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    self.IndividualModel.get(self.getIDfromURN(payload.urn)).run()
      .then(function (model) {
        return model.merge(payload).save().then(function (updated) {
          delete updated.id
          delete updated.company
          delete updated.charity
          delete updated.campaign
          delete updated.item
          resolve(updated)
          global.ABIBAO.services.bus.publish(global.ABIBAO.events.BusEvent.BUS_EVENT_SMF_UPDATE_VOTE, updated)
        })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
