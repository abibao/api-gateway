'use strict'

var _ = require('lodash')

var Cryptr = require('cryptr')
var cryptr = new Cryptr(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'))

module.exports = function (thinky) {
  var type = thinky.type
  var r = thinky.r

  var SurveyModel = thinky.createModel('surveys', {
    // virtuals
    urn: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:survey:' + cryptr.encrypt(this.id)
    }),
    urnCampaign: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:campaign:' + cryptr.encrypt(this.campaign)
    }),
    urnCompany: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:entity:' + cryptr.encrypt(this.company)
    }),
    urnCharity: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:entity:' + cryptr.encrypt(this.charity)
    }),
    urnIndividual: type.virtual().default(function () {
      return _.isUndefined(this.id) ? null : 'urn:abibao:database:individual:' + cryptr.encrypt(this.individual)
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
    // value is an array of database urn ?
    if (_.isArray(value)) {
      _.map(value, function (item) {
        if (_.split(item, 'urn:abibao:database:').length === 2) {
          return global.ABIBAO.services.domain.getIDfromURN(item)
        } else {
          return item
        }
      })
    }
    // value is a database urn ?
    if (_.split(value, 'urn:abibao:database:').length === 2) {
      value = global.ABIBAO.services.domain.getIDfromURN(value)
    }
    return value
  })

  SurveyModel.pre('save', function (next) {
    var data = this
    data.modifiedAt = r.now()
    next()
  })

  return SurveyModel
}
