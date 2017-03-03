'use strict'

var Promise = require('bluebird')
var WP = require('wpapi')

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

module.exports = function (payload) {
  return new Promise(function (resolve, reject) {
    var wp = new WP({
      endpoint: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_URL'),
      username: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_USERNAME'),
      password: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_PASSWORD'),
      auth: true
    })
    wp.posts().create(payload).then(resolve).catch(reject)
  })
}
