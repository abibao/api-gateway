'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (urn) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      self.SurveyModel.get(self.getIDfromURN(urn)).run().then(function (model) {
        return self.EntityModel.get(self.getIDfromURN(model.urnCompany)).run().then(function (company) {
          delete model.id
          delete model.company
          delete model.charity
          delete model.campaign
          delete model.item
          if (company.type === global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_ENTITY_TYPE_ABIBAO) {
            model.isAbibao = true
          } else {
            model.isAbibao = false
          }
          resolve(model)
        })
      })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
