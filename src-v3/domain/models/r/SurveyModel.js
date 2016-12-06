'use strict'

// libraries
const Hoek = require('hoek')
const Joi = require('joi')
const bson = require('bson')
const ObjectId = bson.ObjectId
const _ = require('lodash')
const Cryptr = require('cryptr')

class SurveyModel {
  constructor (domain) {
    this.cryptr = new Cryptr(domain.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))
  }
  schema () {
    return Joi.object().keys({
      campaign: Joi.string().required(),
      company: Joi.string().required(),
      charity: Joi.string().required(),
      individual: Joi.string().required(),
      answers: Joi.object(),
      isAbibao: Joi.boolean().default(false),
      complete: Joi.boolean().default(false)
    })
  }
  transform (data) {
    let result = Hoek.clone(data)
    result.urn = _.isUndefined(result.id) ? null : 'urn:abibao:database:entity:' + this.cryptr.encrypt(result.id)
    result.urnCampaign = _.isUndefined(result.campaign) ? null : 'urn:abibao:database:campaign:' + this.cryptr.encrypt(result.campaign)
    result.urnCompany = _.isUndefined(result.company) ? null : 'urn:abibao:database:entity:' + this.cryptr.encrypt(result.company)
    result.urnCharity = _.isUndefined(result.charity) ? null : 'urn:abibao:database:entity:' + this.cryptr.encrypt(result.charity)
    result.urnIndividual = _.isUndefined(result.individual) ? null : 'urn:abibao:database:individual:' + this.cryptr.encrypt(result.individual)
    return {
      urn: result.urn,
      urnCampaign: result.urnCampaign,
      urnCompany: result.urnCompany,
      urnCharity: result.urnCharity,
      urnIndividual: result.urnIndividual,
      answers: result.answers,
      complete: result.complete,
      isAbibao: result.isAbibao,
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

module.exports = SurveyModel
