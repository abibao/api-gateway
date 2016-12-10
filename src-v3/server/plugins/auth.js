'use strict'

const AuthJWT = require('hapi-auth-jwt2')
const path = require('path')

const Provision = function (server, callback) {
  server.hapi.register({
    register: AuthJWT,
    options: { }
  },
  (error) => {
    const libpath = path.resolve(__dirname, 'libs')
    server.hapi.auth.strategy('jwt', 'jwt', {
      key: server.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'),
      validateFunc: require(path.resolve(libpath, 'auth-jwt-validate')),
      verifyOptions: { algorithms: ['HS256'] }
    })
    callback(error)
  })
}

module.exports = Provision
