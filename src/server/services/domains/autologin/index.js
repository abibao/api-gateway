'use strict'

class Service {
  create (payload) {
    return global.ABIBAO.services.domain.execute('command', 'individualAutologinCommandCreate', payload)
  }
  get (fingerprint) {
    return global.ABIBAO.services.domain.execute('command', 'individualAutologinControlCommand', fingerprint)
  }
}

module.exports = function () {
  const app = this

  app.use('autologin', new Service())
}
