'use strict'

var Hoek = require('hoek')

module.exports = function (urn) {
  var self = Hoek.clone(global.ABIBAO.services.domain)

  return new Promise(function (resolve, reject) {
    try {
      self.r.table('individuals')
        .group('charity').count().ungroup()
        .map(function (item1) {
          return {
            charity: self.r.table('entities').get(item1('group'))('name'),
            count: item1('reduction'),
            emails: self.r.table('individuals').filter({charity: item1('group')}).pluck('email').coerceTo('array').merge(function (item3) {
              return item3('email')
            })
          }
        })
        .then(function (result) {
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
