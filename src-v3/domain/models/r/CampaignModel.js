'use strict'

// libraries
const Hoek = require('hoek')
const Joi = require('joi')
const bson = require('bson')
const ObjectId = bson.ObjectId
const _ = require('lodash')
const Cryptr = require('cryptr')

class CampaignModel {
  constructor (domain) {
    this.cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  }
  schema () {
    return Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string(),
      position: Joi.number().min(0).default(0),
      screenWelcomeContent: Joi.string(),
      screenThankYouContent: Joi.string(),
      company: Joi.string().required(),
      published: Joi.boolean().default(false)
    })
  }
  patch (data) {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      company: data.company,
      position: data.position,
      screenWelcomeContent: data.screenWelcomeContent,
      screenThankYouContent: data.screenThankYouContent,
      createdAt: new Date(data.createdAt).getTime(),
      modifiedAt: new Date(data.modifiedAt).getTime()
    }
  }
  transform (data) {
    let result = Hoek.clone(data)
    result.urn = _.isUndefined(result.id) ? null : 'urn:abibao:database:campaign:' + this.cryptr.encrypt(result.id)
    result.urnCompany = _.isUndefined(this.company) ? null : 'urn:abibao:database:entity:' + this.cryptr.encrypt(this.company)
    return {
      urn: result.urn,
      urnCompany: result.urnCompany,
      name: result.name,
      description: result.description,
      position: result.position,
      screenWelcomeContent: result.screenWelcomeContent,
      screenThankYouContent: result.screenThankYouContent,
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

module.exports = CampaignModel
