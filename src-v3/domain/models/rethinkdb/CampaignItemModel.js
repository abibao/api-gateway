'use strict'

module.exports = function (domain) {
  const _ = domain.modules.get('lodash')
  const Cryptr = domain.modules.get('cryptr')
  const cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  const type = domain.databases.thinky.type
  const r = domain.databases.thinky.r

  const CampaignItemModel = domain.databases.thinky.createModel('campaigns_items', {
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
    let data = this
    data.modifiedAt = r.now()
    next()
  })

  return CampaignItemModel
}
