'use strict'

var Promise = require('bluebird')
var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    payload.company = self.getIDfromURN(payload.urnCompany)
    self.execute('command', 'campaignCreateCommand', payload).then(resolve).catch(reject)
  })
}
