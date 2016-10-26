'use strict'

var Basic = require('hapi-auth-basic')
var AuthJWT = require('hapi-auth-jwt2')

var AuthProvision = function (server, callback) {
  server.register([
    {register: Basic},
    {register: AuthJWT}
  ],
    function () {
      server.auth.strategy('jwt', 'jwt', {
        key: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'),
        validateFunc: require('./libs/auth_jwt_validate.js'),
        verifyOptions: { algorithms: ['HS256'] }
      })
      callback()
    })
}

module.exports = AuthProvision
