'use strict'

var _ = require('lodash')
var faker = require('faker')

var crypto = require('crypto')
var Cryptr = require('cryptr')
var cryptr = new Cryptr(global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'))

module.exports = function (thinky) {
  var type = thinky.type
  var r = thinky.r

  var IndividualModel = thinky.createModel('individuals', {
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
    var salt = new Buffer(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
  })

  IndividualModel.define('getFakeData', function () {
    return {
      email: faker.internet.email().toLowerCase(),
      password: faker.name.lastName().toLowerCase()
    }
  })

  return IndividualModel
}
