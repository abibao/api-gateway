'use strict';

var Basic = require('hapi-auth-basic');
var AuthJWT = require('hapi-auth-jwt2');

var AuthProvision = function(server, seneca) {
  
  server.register([ {register: Basic}, {register: AuthJWT} ], function (err) {
    
    if (err) return seneca.log.error('auth provision', err);
    seneca.log.info('auth provision', 'registered');
    
    server.auth.strategy('basic', 'basic', {
      validateFunc: require('../libs/auth_basic_validate.js')
    });
    
    server.auth.strategy('jwt', 'jwt', {
      key: process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY,
      validateFunc: require('../libs/auth_jwt_validate.js'),
      verifyOptions: { algorithms: [ 'HS256' ] },
    });
    
  });

};

module.exports = AuthProvision;