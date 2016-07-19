'use strict'

var Crumb = require('crumb')

var CrumbProvision = function (server, callback) {
  server.register({
    register: Crumb,
    options: {
      key: 'CSRF-TOKEN',
      restful: true
    }
  }, function (err) {
    if (err) { return callback(err) }
    callback()
  })
}

module.exports = CrumbProvision
