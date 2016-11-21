'use strict'

var Nes = require('nes')

var NesProvision = function (server, callback) {
  server.register(
    Nes,
    function () {
      callback()
    })
}

module.exports = NesProvision
