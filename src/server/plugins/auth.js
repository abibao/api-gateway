'use strict'

var AuthJWT = require('hapi-auth-jwt2')

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.socket,
  error: global.ABIBAO.debuggers.error
}

var AuthProvision = function (server, callback) {
  server.register({
    register: AuthJWT,
    options: {
    }
  },
  (error) => {
    if (error) {
      abibao.error(error)
    }
    server.auth.strategy('jwt', 'jwt', {
      key: global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'),
      validateFunc: require('./libs/auth_jwt_validate.js'),
      verifyOptions: { algorithms: ['HS256'] }
    })
    callback(error)
  })
}

module.exports = AuthProvision
