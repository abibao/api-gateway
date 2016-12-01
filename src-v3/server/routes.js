'use strict'

exports.endpoints = [
  // server is alive
  { method: 'GET', path: '/v1/alive', config: require('./handlers/alive') }
]
