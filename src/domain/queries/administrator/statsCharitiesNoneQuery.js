'use strict'

module.exports = function () {
  var self = global.ABIBAO.services.domain
  return new Promise(function (resolve, reject) {
    try {
      self.thinky.r.table('individuals').filter({charity: 'none'})
        .map(function (item1) {
          return {
            email: item1('email'),
            surveys: self.thinky.r.table('surveys')
              .filter({individual: item1('id')}).coerceTo('array')
              .merge(function (item2) {
                return {
                  campaign: self.thinky.r.table('campaigns').get(item2('campaign')).pluck('name')
                }
              }).pluck('answers', 'campaign')

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
