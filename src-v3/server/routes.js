'use strict'

exports.endpoints = [
  // server is alive
  { method: 'GET', path: '/v1/alive', config: require('./handlers/alive') },
  // individuals
  { method: 'POST', path: '/v1/individuals/login', config: require('./handlers/individuals/login') },
  { method: 'POST', path: '/v1/individuals/register', config: require('./handlers/individuals/register') }
]
