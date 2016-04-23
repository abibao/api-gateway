'use strict'

var Promise = require('bluebird')
var Service = require('./../../src/services')

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    Service.startDomain(function (error) {
      if (error) { reject(error) }
      global.domain = Service.domain()
      resolve()
    })
  })
}
