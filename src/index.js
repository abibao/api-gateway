'use strict'

// use new relic agent
require('newrelic')

var engine = require('./engine')

engine()
  .then(function () {
    global.ABIBAO.debuggers.application('engine is running')
  })
  .catch(function (error) {
    global.ABIBAO.debuggers.error('engine is not running')
    console.log(error)
    process.exit(1)
  })
