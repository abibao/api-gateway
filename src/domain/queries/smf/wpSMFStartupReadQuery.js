var Promise = require('bluebird')

var WP = require('wpapi')

module.exports = function (wpid) {
  return new Promise(function (resolve, reject) {
    try {
      var finalResult = {}
      var wp = new WP({
        endpoint: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_WPSMF_URL'),
        username: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_USERNAME'),
        password: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_WPSMF_AUTH_BASIC_PASSWORD')
      })
      wp.posts().auth().id(wpid)
        .then(function (result) {
          finalResult = {
            title: result.title.rendered,
            link: result.link,
            content: result.content.rendered,
            media: result.featured_media
          }
          return finalResult.media
        })
        .then(function (media) {
          return wp.media().auth().id(media)
        })
        .then(function (result) {
          finalResult.media = result.media_details
          resolve(finalResult)
        })
        .catch(reject)
    } catch (e) {
      reject(e)
    }
  })
}
