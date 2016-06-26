'use strict'

module.exports = {
  security: true,
  auth: false,
  jsonp: 'callback',
  handler(request, reply) {
    return reply({ alive: true, csrf: request.plugins.crumb })
  }
}
