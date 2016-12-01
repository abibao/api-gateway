'use strict'

module.exports = function (domain) {
  const _ = domain.modules.get('lodash')
  const crypto = domain.modules.get('crypto')
  const Cryptr = domain.modules.get('cryptr')
  const cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  const type = domain.databases.thinky.type
  const r = domain.databases.thinky.r

  const IndividualModel = domain.databases.thinky.createModel('individuals', {
    // virtuals
    urn: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:individual:' + cryptr.encrypt(this.id)
    }),
    urnCharity: type.virtual().default(function () {
      return _.isUndefined(this.charity) ? null : 'urn:abibao:database:entity:' + cryptr.encrypt(this.charity)
    }),
    urnRegisteredEntity: type.virtual().default(function () {
      return _.isUndefined(this.hasRegisteredEntity) ? null : 'urn:abibao:database:entity:' + cryptr.encrypt(this.hasRegisteredEntity)
    }),
    urnRegisteredSurvey: type.virtual().default(function () {
      return _.isUndefined(this.hasRegisteredSurvey) ? null : 'urn:abibao:database:campaign:' + cryptr.encrypt(this.hasRegisteredSurvey)
    }),
    // fields
    email: type.string().email().required(),
    scope: type.string().default('individual'),
    verified: type.boolean().default(false),
    // linked
    charity: type.string().default('none'),
    hasRegisteredEntity: type.string().default('none'),
    hasRegisteredSurvey: type.string().default('none'),
    hasRegisteredSource: type.string().default('none'),
    // calculated
    hashedPassword: type.string(),
    salt: type.string(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  })

  IndividualModel.pre('save', function (next) {
    let data = this
    data.modifiedAt = r.now()
    // salt exists ?
    if (data.salt) {
      return next()
    }
    data.salt = this.makeSalt()
    data.hashedPassword = data.encryptPassword(data.password)
    delete data.password
    next()
  })

  IndividualModel.define('authenticate', function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword
  })

  IndividualModel.define('makeSalt', function () {
    return crypto.randomBytes(16).toString('base64')
  })

  IndividualModel.define('encryptPassword', function (password) {
    if (!password || !this.salt) {
      return ''
    }
    const salt = new Buffer(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
  })

  return IndividualModel
}
