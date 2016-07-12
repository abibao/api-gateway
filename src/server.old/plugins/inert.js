'use strict'

var Inert = require('inert')

var InertProvision = function (server, callback) {
  server.register(
    Inert,
    function (err) {
      if (err) { return callback(err) }
      callback()
    })
}

module.exports = InertProvision
