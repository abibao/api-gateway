'use strict'

// libraries
const bucker = require('bucker')

const Provision = function (server, callback) {
  server.register({
    register: bucker,
    options: {
      access: 'abibao-gateway.access',
      error: 'abibao-gateway.error',
      hapi: {
        handleLog: false
      },
      handleExceptions: true,
      file: {
        filename: 'abibao-gateway.log',
        format: ':level :time :data',
        timestamp: 'HH:mm:ss',
        accessFormat: ':time :level :method :status :url'
      },
      console: {
        color: false
      }
    }
  },
  (error) => {
    callback(error)
  })
}

module.exports = Provision
