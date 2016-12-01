'use strict'

module.exports = function (domain) {
  const _ = domain.modules.get('lodash')
  const Cryptr = domain.modules.get('cryptr')
  const cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  const type = domain.databases.thinky.type
  const r = domain.databases.thinky.r

  const CampaignModel = domain.databases.thinky.createModel('campaigns', {
    // virtuals
    urn: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:campaign:' + cryptr.encrypt(this.id)
    }),
    urnCompany: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:entity:' + cryptr.encrypt(this.company)
    }),
    // fields
    name: type.string().required(),
    description: type.string(),
    position: type.number().min(0).default(0),
    screenWelcomeContent: type.string(),
    screenThankYouContent: type.string(),
    // linked
    company: type.string().required(), // entité de type "company" qui fournit le sondage
    // automatic
    published: type.boolean().default(false),
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  })

  CampaignModel.pre('save', function (next) {
    let data = this
    data.modifiedAt = r.now()
    next()
  })

  return CampaignModel
}
