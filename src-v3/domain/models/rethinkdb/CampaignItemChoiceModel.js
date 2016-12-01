'use strict'

module.exports = function (domain) {
  const _ = domain.modules.get('lodash')
  const Cryptr = domain.modules.get('cryptr')
  const cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  const type = domain.databases.thinky.type
  const r = domain.databases.thinky.r

  const CampaignItemChoiceModel = domain.databases.thinky.createModel('campaigns_items_choices', {
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
    let data = this
    data.modifiedAt = r.now()
    next()
  })

  return CampaignItemChoiceModel
}
