'use strict'

var _ = require('lodash')
var faker = require('faker')

var Cryptr = require('cryptr')
var cryptr = new Cryptr(global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'))

module.exports = function (thinky) {
  var type = thinky.type
  var r = thinky.r

  var SurveyModel = thinky.createModel('surveys', {
    // virtuals
    urn: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:survey:' + cryptr.encrypt(this.id)
    }),
    urnCampaign: type.virtual().default(function () {
      return _.isUndefined(this.campaign) ? null : 'urn:abibao:database:campaign:' + cryptr.encrypt(this.campaign)
    }),
    urnCompany: type.virtual().default(function () {
      return _.isUndefined(this.company) ? null : 'urn:abibao:database:entity:' + cryptr.encrypt(this.company)
    }),
    urnCharity: type.virtual().default(function () {
      return _.isUndefined(this.charity) ? null : 'urn:abibao:database:entity:' + cryptr.encrypt(this.charity)
    }),
    urnIndividual: type.virtual().default(function () {
      return _.isUndefined(this.individual) ? null : 'urn:abibao:database:individual:' + cryptr.encrypt(this.individual)
    }),
    // linked
    campaign: type.string().required(),
    company: type.string().required(), // entité de type "entreprise" qui fournit le sondage
    charity: type.string().required(), // "entity" de type "assocation" à qui profite le sondage
    individual: type.string().required(), // "user" de type "individual" à qui est affecté le sondage
    //
    answers: type.object(),
    complete: type.boolean().default(false),
    completeAt: type.date(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  })

  SurveyModel.define('formatAnswer', function (component, value) {
    var result
    switch (true) {
      // value is an array of database urn ?
      case _.isArray(value):
        result = []
        _.map(value, function (item) {
          if (_.split(item, 'urn:abibao:database:').length === 2) {
            result.push(global.ABIBAO.services.domain.getIDfromURN(item))
          } else {
            result.push(item)
          }
        })
        break
      // value is a database urn ?
      case _.split(value, 'urn:abibao:database:').length === 2:
        result = global.ABIBAO.services.domain.getIDfromURN(value)
        break
      // others cases
      default:
        result = value
        break
    }
    return result
  })

  SurveyModel.pre('save', function (next) {
    var data = this
    data.modifiedAt = r.now()
    next()
  })

  SurveyModel.define('getFakeData', function () {
    return {
      campaign: faker.name.lastName().toLowerCase(),
      company: faker.name.lastName().toLowerCase(),
      charity: faker.name.lastName().toLowerCase(),
      individual: faker.name.lastName().toLowerCase(),
      answers: {}
    }
  })

  return SurveyModel
}
