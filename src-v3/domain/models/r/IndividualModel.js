'use strict'

// libraries
const Hoek = require('hoek')
const bson = require('bson')
const ObjectId = bson.ObjectId
const _ = require('lodash')
const crypto = require('crypto')
const Cryptr = require('cryptr')

class IndividualModel {
  constructor (domain) {
    this.cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  }
  transform (data) {
    let result = Hoek.clone(data)
    result.urn = _.isUndefined(result.id) ? null : 'urn:abibao:database:individual:' + this.cryptr.encrypt(result.id)
    result.urnCharity = _.isUndefined(result.charity) ? null : 'urn:abibao:database:entity:' + this.cryptr.encrypt(result.charity)
    result.urnRegisteredEntity = _.isUndefined(result.hasRegisteredEntity) ? null : 'urn:abibao:database:entity:' + this.cryptr.encrypt(result.hasRegisteredEntity)
    result.urnRegisteredSurvey = _.isUndefined(result.hasRegisteredSurvey) ? null : 'urn:abibao:database:campaign:' + this.cryptr.encrypt(result.hasRegisteredSurvey)
    delete result.id
    delete result.hashedPassword
    delete result.salt
    delete result.charity
    delete result.hasRegisteredSurvey
    delete result.hasRegisteredEntity
    return result
  }
  create (data) {
    data.id = new ObjectId().toString()
    data.createdAt = Date.now()
    data.modifiedAt = Date.now()
    data.salt = this.makeSalt()
    data.hashedPassword = this.encryptPassword(data.password, data.salt)
    delete data.password
    return data
  }
}

IndividualModel.prototype.authenticate = function (password, data) {
  return this.encryptPassword(password, data.salt) === data.hashedPassword
}

IndividualModel.prototype.makeSalt = function () {
  return crypto.randomBytes(16).toString('base64')
}

IndividualModel.prototype.encryptPassword = function (password, psalt) {
  const salt = new Buffer(psalt, 'base64')
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
}

module.exports = IndividualModel
