'use strict'

var Promise = require('bluebird')

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    global.ABIBAO.debuggers.bus('Check SMF vote for [%s]', message.email)
  })
}
