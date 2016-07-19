'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

module.exports = {
  'host': nconf.get('ABIBAO_API_GATEWAY_EXPOSE_IP'),
  'port': nconf.get('ABIBAO_API_GATEWAY_EXPOSE_PORT'),
  'public': '../../../build/',
  'corsWhitelist': ['localhost'],
  'auth': {
    'idField': 'urn',
    'token': {
      'secret': nconf.get('ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY'),
      'payload': ['urn', 'email']
    },
    'local': {}
  }
}
