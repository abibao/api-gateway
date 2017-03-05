'use strict'

var _ = require('lodash')
var faker = require('faker')

var Cryptr = require('cryptr')
var cryptr = new Cryptr(global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'))

module.exports = function (thinky) {
  var type = thinky.type
  var r = thinky.r

  var CampaignItemChoiceModel = thinky.createModel('campaigns_items_choices', {
    // virtuals
    urn: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:campaign:choice:' + cryptr.encrypt(this.id)
    }),
    urnItem: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:campaign:item:' + cryptr.encrypt(this.item)
    }),
    urnCampaign: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:campaign:' + cryptr.encrypt(this.campaign)
    }),
    meta: type.virtual().default(function () {
      return this.prefix + '__' + this.suffix
    }),
    // fields
    prefix: type.string().required(),
    suffix: type.string().required(),
    text: type.string().required(),
    position: type.number().integer().min(0).required(),
    // linked
    item: type.string().required(),
    campaign: type.string().required(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  })

  CampaignItemChoiceModel.pre('save', function (next) {
    var data = this
    data.modifiedAt = r.now()
    next()
  })

  CampaignItemChoiceModel.define('getFakeData', function () {
    return {
      prefix: faker.name.lastName().toLowerCase(),
      suffix: faker.name.lastName().toLowerCase(),
      text: faker.name.lastName().toLowerCase(),
      position: faker.random.number(),
      item: faker.name.lastName().toLowerCase(),
      campaign: faker.name.lastName().toLowerCase()
    }
  })

  return CampaignItemChoiceModel
}
