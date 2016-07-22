'use strict'

var _ = require('lodash')
var faker = require('faker')

var Cryptr = require('cryptr')
var cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))

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
    password: type.virtual().default(function () {
      return cryptr.encrypt(this.email)
    }),
    // fields
    email: type.string().email().required(),
    scope: type.string().default('individual'),
    fingerprint: type.date(),
    // linked
    charity: type.string().default('none'),
    hasRegisteredEntity: type.string().default('none'),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  })

  IndividualModel.pre('save', function (next) {
    var data = this
    data.modifiedAt = r.now()
    next()
  })

  IndividualModel.define('getFakeData', function () {
    var email = faker.internet.email().toLowerCase()
    return {
      email: email,
      password: cryptr.encrypt(email)
    }
  })

  return IndividualModel
}
