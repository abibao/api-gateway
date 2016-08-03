'use strict'

const Promise = require('bluebird')
const Hoek = require('hoek')
const rp = require('request-promise')

class Service {
  setup (app) {
    this.app = app
  }
  create (payload) {
    return global.ABIBAO.services.domain.execute('command', 'individualAutologinCreateCommand', payload)
  }
  get (fingerprint) {
    const app = this.app
    let dataUser
    return new Promise(function (resolve, reject) {
      global.ABIBAO.services.domain.execute('command', 'individualAutologinControlCommand', fingerprint)
        .then(function (result) {
          dataUser = Hoek.clone(result.data.user)
          return app.service('users').find({email: dataUser.email})
        })
        .then(function (result) {
          if (result.length === 0) {
            return app.service('users').create({
              urn: dataUser.urn,
              email: dataUser.email,
              password: dataUser.password
            })
          } else {
            return app.service('users').get(dataUser.urn)
          }
        })
        .then(function () {
          const options = {
            method: 'POST',
            uri: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_URI') + '/auth/local',
            body: {
              email: dataUser.email,
              password: dataUser.password
            },
            headers: {
              'Content-Type': 'application/json'
            },
            json: true
          }
          return rp(options)
        })
        .then(resolve)
        .catch(reject)
    })
  }
}

module.exports = function () {
  const app = this
  app.use('v1/autologin', new Service())
  const service = app.service('v1/autologin')
}
