'use strict'

var Inert = require('inert')

var InertProvision = function (server, callback) {
  server.register(
    Inert,
    function () {
      callback()
    })
}

module.exports = InertProvision
