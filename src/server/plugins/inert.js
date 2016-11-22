'use strict'

var Inert = require('inert')

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.socket,
  error: global.ABIBAO.debuggers.error
}

var InertProvision = function (server, callback) {
  server.register({
    register: Inert,
    options: {}
  },
  (error) => {
    if (error) {
      abibao.error(error)
    }
    callback(error)
  })
}

module.exports = InertProvision
