'use strict'

var Hoek = require('hoek')
var _ = require('lodash')

module.exports = function () {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      self.r.table('surveys')
        .map(function (item1) {
          return item1('answers')
        })
        .group('ABIBAO_ANSWER_FONDAMENTAL_GENDER')
        .count()
        .ungroup()
        .filter(function (item3) {
          return item3.hasFields('group')
        })
        .map(function (item2) {
          return {
            answer: self.r.table('campaigns_items_choices').get(item2('group')).merge(function (item4) {
              return item4('prefix').add('__').add(item4('suffix'))
            }),
            count: item2('reduction')
          }
        })
        .then(function (result) {
          var totalMales = 0
          var totalFemales = 0
          _.map(result, function (item) {
            if (item.answer === 'GENDER__MALE') { totalMales = item.count }
            if (item.answer === 'GENDER__FEMALE') { totalFemales = item.count }
          })
          var total = totalMales + totalFemales
          var genders = {
            total,
            men: totalMales,
            women: totalFemales,
            percent: {
              men: Math.round(100 * totalMales / (total)),
              women: Math.round(100 * totalFemales / (total))
            }
          }
          resolve(genders)
        })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
