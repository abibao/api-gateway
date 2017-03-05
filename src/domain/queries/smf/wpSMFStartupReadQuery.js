'use strict'

var Promise = require('bluebird')
var WP = require('wpapi')

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

module.exports = function (wpid) {
  return new Promise(function (resolve, reject) {
    var finalResult = {}
    var wp = new WP({
      endpoint: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_URI'),
      username: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_USER'),
      password: global.ABIBAO.config('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_PASS'),
      auth: true
    })
    wp.posts().id(wpid).get()
      .then(function (result) {
        finalResult = {
          title: result.title.rendered,
          link: result.link,
          content: result.content.rendered,
          media: result['featured_media']
        }
        return finalResult.media
      })
      .then(function (media) {
        return wp.media().auth().id(media)
      })
      .then(function (result) {
        finalResult.media = result['media_details']
        resolve(finalResult)
      })
      .catch(reject)
  })
}
