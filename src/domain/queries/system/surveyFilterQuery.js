'use strict'

var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function (filters) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    self.SurveyModel.filter(filters)
      .then(function (models) {
        _.map(models, function (model) {
          delete model.id
          delete model.company
          delete model.charity
          delete model.campaign
          delete model.item
        })
        resolve(models)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
