'use strict'

module.exports = {
  auth: false,
  jsonp: 'callback',
  handler (request, reply) {
    return reply({ alive: true })
  }
}
