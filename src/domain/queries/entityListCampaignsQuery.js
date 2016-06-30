'use strict'

var _ = require('lodash')
var Hoek = require('hoek')

module.exports = function (urn) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      var id = self.getIDfromURN(urn)
      self.r.table('entities').get(id).merge(function (entity) {
        return {
          campaigns: self.r.table('campaigns').filter({company: entity('id')}).without('company').coerceTo('array').merge(function (campaign) {
            return {
              urn: campaign('id'),
              items: self.r.table('campaigns_items').filter({campaign: campaign('id')}).without('campaign').coerceTo('array').merge(function (item) {
                return {
                  urn: item('id')
                }
              })
            }
          })
        }
      })
        .then(function (result) {
          if (result.type !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_COMPANY && result.type !== global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_ABIBAO) { return reject('This entity has a bad type') }
          _.map(result.campaigns, function (campaign) {
            delete campaign.id
            campaign.urn = self.getURNfromID(campaign.urn, 'campaign')
            _.map(campaign.items, function (item) {
              delete item.id
              item.urn = self.getURNfromID(item.urn, 'item')
            })
          })
          resolve(result.campaigns)
        })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
