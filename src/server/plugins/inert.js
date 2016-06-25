'use strict'

var Cors = require('hapi-cors')

var CorsProvision = function (server, callback) {
  server.register([Cors], function (err) {
    if (err) { return callback(err) }
    callback()
  })
}

module.exports = CorsProvision
