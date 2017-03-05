'use strict'

var _ = require('lodash')

module.exports = function () {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    try {
      self.thinky.r.table('individuals')
        .group('charity').count().ungroup()
        .map(function (item1) {
          return {
            charity: {
              urn: self.thinky.r.table('entities').get(item1('group'))('id'),
              name: self.thinky.r.table('entities').get(item1('group'))('name')
            },
            count: item1('reduction'),
            emails: self.thinky.r.table('individuals').filter({charity: item1('group')}).pluck('email').coerceTo('array').merge(function (item3) {
              return item3('email')
            })
          }
        })
        .then(function (result) {
          _.map(result, function (stat) {
            stat.charity.urn = self.getURNfromID(stat.charity.urn, 'entity')
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
