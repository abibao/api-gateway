'use strict'

// libraries
const Hoek = require('hoek')
const Joi = require('joi')
const bson = require('bson')
const ObjectId = bson.ObjectId
const _ = require('lodash')
const Cryptr = require('cryptr')

class EntityModel {
  constructor (domain) {
    this.cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  }
  schema () {
    return Joi.object().keys({
      name: Joi.string().required(),
      contact: Joi.string().email().required(),
      url: Joi.string().default('').required(),
      type: Joi.string().valid(['none', 'abibao', 'charity', 'company']).required(),
      icon: Joi.string().default('images/icons/default.png'),
      avatar: Joi.string().default('images/avatars/default.png'),
      picture: Joi.string().default('images/pictures/default.png'),
      title: Joi.string().required(),
      hangs: Joi.string().required(),
      description: Joi.string().required(),
      usages: Joi.string().required()
    })
  }
  transform (data) {
    let result = Hoek.clone(data)
    result.urn = _.isUndefined(result.id) ? null : 'urn:abibao:database:entity:' + this.cryptr.encrypt(result.id)
    return {
      urn: result.urn,
      name: result.name,
      contact: result.contact,
      url: result.url,
      type: result.type,
      icon: result.icon,
      avatar: result.avatar,
      picture: result.picture,
      title: result.title,
      hangs: result.hangs,
      description: result.description,
      usages: result.usages,
      createdAt: result.createdAt,
      modifiedAt: result.modifiedAt
    }
  }
  create (data) {
    data.id = new ObjectId().toString()
    data.createdAt = Date.now()
    data.modifiedAt = Date.now()
    return data
  }
}

module.exports = EntityModel
