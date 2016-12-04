'use strict'

const Inert = require('inert')

// use debuggers reference
const abibao = {
  debug: global.ABIBAO.debuggers.socket,
  error: global.ABIBAO.debuggers.error
}

const InertProvision = function (server, callback) {
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
