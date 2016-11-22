'use strict'

var Nes = require('nes')

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.socket,
  error: global.ABIBAO.debuggers.error
}

var NesProvision = function (server, callback) {
  server.register({
    register: Nes,
    options: {
      onConnection: (socket) => {
        abibao.debug(socket.id, socket.app, socket.auth)
      }
    }
  },
  (error) => {
    if (error) {
      abibao.error(error)
    }
    callback(error)
  })
}

module.exports = NesProvision
