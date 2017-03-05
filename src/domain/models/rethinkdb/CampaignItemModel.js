'use strict'

var _ = require('lodash')
var faker = require('faker')

var Cryptr = require('cryptr')
var cryptr = new Cryptr(global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'))

module.exports = function (thinky) {
  var type = thinky.type
  var r = thinky.r

  var CampaignItemModel = thinky.createModel('campaigns_items', {
    // virtuals
    urn: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:campaign:item:' + cryptr.encrypt(this.id)
    }),
    urnCampaign: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:campaign:' + cryptr.encrypt(this.campaign)
    }),
    // fields
    label: type.string().required(),
    type: type.string().required(),
    tags: type.string(),
    position: type.number().min(0).default(0),
    // linked
    campaign: type.string().required(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  })

  CampaignItemModel.pre('save', function (next) {
    var data = this
    data.modifiedAt = r.now()
    next()
  })

  CampaignItemModel.define('getFakeData', function () {
    return {
      label: faker.name.lastName().toLowerCase(),
      type: faker.name.lastName().toLowerCase(),
      campaign: faker.name.lastName().toLowerCase()
    }
  })

  return CampaignItemModel
}
