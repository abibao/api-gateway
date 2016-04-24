'use strict'

var debug = require('debug')('abibao:initializers')
debug('start')

// load configurations
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

require('newrelic')

// declare services
var Services = require('./services')

// manage instances
var server = Services.server()
var domain = Services.domain()
var bus = Services.bus()

Services.startDomain(function (err) {
  if (err) { return debug(err) }
  Services.startServer(function (err) {
    if (err) { return debug(err) }
    // inject domain in server
    server.domain = domain
    debug('end')
  })
})
