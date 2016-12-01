'use strict'

module.exports = function (domain) {
  const _ = domain.modules.get('lodash')
  const Cryptr = domain.modules.get('cryptr')
  const cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  const type = domain.databases.thinky.type
  const r = domain.databases.thinky.r

  const EntityModel = domain.databases.thinky.createModel('entities', {
    // virtuals
    urn: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:entity:' + cryptr.encrypt(this.id)
    }),
    // fields
    name: type.string().required(),
    contact: type.string().email().required(),
    url: type.string().default('').required(),
    type: type.string().enum(['none', 'abibao', 'charity', 'company']).required(),
    icon: type.string().default('images/icons/default.png'),
    avatar: type.string().default('images/avatars/default.png'),
    picture: type.string().default('images/pictures/default.png'),
    title: type.string().required(),
    hangs: type.string().required(),
    description: type.string().required(),
    usages: type.string().required(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  })

  EntityModel.pre('save', function (next) {
    let data = this
    data.modifiedAt = r.now()
    next()
  })

  return EntityModel
}
