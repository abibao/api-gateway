'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    self.execute('query', 'administratorFilterQuery', {email: payload.email})
      .then(function (administrators) {
        if (administrators.length === 0) {
          throw new Error('Email address and/or password invalid')
        }
        if (administrators.length > 1) {
          throw new Error('Too many emails, contact an administrator')
        }
        var administrator = administrators[0]
        if (administrator.authenticate(payload.password)) {
          // all done then reply token
          return self.execute('command', 'administratorCreateAuthTokenCommand', administrator.urn)
            .then(function (token) {
              resolve({
                token,
                urn: administrator.urn
              })
            })
        } else {
          throw new Error('Email address and/or password invalid')
        }
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
