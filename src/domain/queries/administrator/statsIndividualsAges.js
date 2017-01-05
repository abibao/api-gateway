'use strict'

var _ = require('lodash')

module.exports = function (value) {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    try {
      var gender = (value === 'MALE') ? '56ee9a414726e973079d96d0' : '56ee9a414726e973079d96d1'
      self.r.table('surveys')
        .map(function (item1) {
          return item1('answers')
        })
        .hasFields('ABIBAO_ANSWER_FONDAMENTAL_GENDER')
        .filter({'ABIBAO_ANSWER_FONDAMENTAL_GENDER': gender})
        .group('ABIBAO_ANSWER_FONDAMENTAL_AGE')
        .count()
        .ungroup()
        .filter(function (item3) {
          return item3.hasFields('group')
        })
        .map(function (item2) {
          return {
            age: self.r.expr(new Date()).year().sub(item2('group').coerceTo('number')),
            birthdate: item2('group').coerceTo('number'),
            count: item2('reduction')
          }
        })
        .then(function (data) {
          var result = {
            total: 0,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
          // 0: 0-4
          // 1: 5-14
          // 2: 15-24
          // 3: 25-34
          // 4: 35-44
          // etc...
          _.map(data, function (stat) {
            result.data[Math.round(stat.age / 10)] = result.data[Math.round(stat.age / 10)] + stat.count
            result.total += stat.count
          })
          resolve(result)
        })
        .catch(function (error) {
          reject(error)
        })
    } catch (e) {
      reject(e)
    }
  })
}
