'use strict'

const Provision = function (server, callback) {
  const bucker = server.methods.modules.get('bucker')
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
  }, (error) => {
    callback(error)
  })
}

module.exports = Provision
