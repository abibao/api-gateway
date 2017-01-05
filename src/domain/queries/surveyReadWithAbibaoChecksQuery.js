'use strict'

var Promise = require('bluebird')
var Hoek = require('hoek')

module.exports = function (urn) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    var waterfall = null
    self.SurveyModel.get(self.getIDfromURN(urn)).run()
      .then(function (survey) {
        waterfall = Hoek.clone(survey)
        return self.EntityModel.get(self.getIDfromURN(waterfall.urnCompany)).run()
      })
      .then(function (company) {
        waterfall.isAbibao = (company.type === global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_ABIBAO)
        return self.CampaignModel.get(self.getIDfromURN(waterfall.urnCampaign)).run()
      })
      .then(function (campaign) {
        delete waterfall.id
        delete waterfall.company
        delete waterfall.charity
        delete waterfall.campaign
        delete waterfall.item
        waterfall.position = campaign.position
        resolve(waterfall)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
