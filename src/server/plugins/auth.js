"use strict";

var Basic = require('hapi-auth-basic');
var AuthJWT = require('hapi-auth-jwt2');

var AuthProvision = function(server, callback) {

  server.register([ {register: Basic}, {register: AuthJWT} ], function (err) {
    
    if (err) return callback(err);
    // server.logger.info('auth registered provision');
    
    server.auth.strategy('basic', 'basic', {
      validateFunc: require('./libs/auth_basic_validate.js')
    });
    
    server.auth.strategy('jwt', 'jwt', {
      key: process.env.ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY || 'JWT_KEY',
      validateFunc: require('./libs/auth_jwt_validate.js'),
      verifyOptions: { algorithms: [ 'HS256' ] },
    });
    
    callback();
    
  });

};

module.exports = AuthProvision;