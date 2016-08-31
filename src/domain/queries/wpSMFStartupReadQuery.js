var Promise = require('bluebird')

var Hoek = require('hoek')
var WP = require( 'wpapi' );
var wp = new WP({ endpoint: 'http://startupmarketfit.com/wp-json' });

module.exports = function (urn) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    try {
      wp.posts().id(8).then(resolve).catch(reject)
    } catch (e) {
      reject(e)
    }
  })
}
