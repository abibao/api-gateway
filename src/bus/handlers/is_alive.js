'use strict'

var Promise = require('bluebird')

module.exports = function () {
  return new Promise(function (resolve) {
    global.ABIBAO.debuggers.bus('bus is alive')
    resolve()
  })
}
