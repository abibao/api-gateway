'use strict'

var Promise = require('bluebird')
var WP = require('wpapi')

module.exports = function (payload) {
  return new Promise(function (resolve, reject) {
    var wp = new WP({
      endpoint: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_URI'),
      username: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_USER'),
      password: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_PASS'),
      auth: true
    })
    wp.posts().create(payload).then(resolve).catch(reject)
  })
}
