'use strict'

module.exports = function (domain) {
  const _ = domain.modules.get('lodash')
  const crypto = domain.modules.get('crypto')
  const Cryptr = domain.modules.get('cryptr')
  const cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  const type = domain.databases.thinky.type
  const r = domain.databases.thinky.r

  const AdministratorModel = domain.databases.thinky.createModel('administrators', {
    // virtuals
    urn: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:administrator:' + cryptr.encrypt(this.id)
    }),
    // fields
    email: type.string().email().required(),
    scope: type.string().default('administrator'),
    // calculated
    hashedPassword: type.string(),
    salt: type.string(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  })

  AdministratorModel.pre('save', function (next) {
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

  AdministratorModel.define('authenticate', function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword
  })

  AdministratorModel.define('makeSalt', function () {
    return crypto.randomBytes(16).toString('base64')
  })

  AdministratorModel.define('encryptPassword', function (password) {
    if (!password || !this.salt) {
      return ''
    }
    const salt = new Buffer(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
  })

  return AdministratorModel
}
