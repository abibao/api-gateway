'use strict'

var faker = require('faker')

var crypto = require('crypto')
var Cryptr = require('cryptr')
var cryptr = new Cryptr(global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'))

module.exports = function (thinky) {
  var type = thinky.type
  var r = thinky.r

  var AdministratorModel = thinky.createModel('administrators', {
    // virtuals
    urn: type.virtual().default(function () {
      return (this.id) ? 'urn:abibao:database:administrator:' + cryptr.encrypt(this.id) : null
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
    var data = this
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
    var salt = new Buffer(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
  })

  AdministratorModel.define('getFakeData', function () {
    return {
      email: faker.internet.email().toLowerCase(),
      password: faker.name.lastName().toLowerCase()
    }
  })

  return AdministratorModel
}
