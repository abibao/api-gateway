'use strict'

const Promise = require('bluebird')

class Service {
  create (payload) {
    return global.ABIBAO.services.domain.execute('command', 'individualAutologinCreateCommand', payload)
  }
  get (fingerprint) {
    return global.ABIBAO.services.domain.execute('command', 'individualAutologinControlCommand', fingerprint)
  }
}

module.exports = function () {
  const app = this
  app.use('v1/autologin', new Service())
  const service = app.service('v1/autologin')
}
