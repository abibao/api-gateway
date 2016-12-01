'use strict'

const Engine = require('./lib/Engine')

const engine = new Engine()
engine.initialize()
  .then(function () {
    engine.debug('engine is initialized, mode is [%s]', engine.nconf.get('ABIBAO_API_GATEWAY_ENV'))
  })
  .catch(function (error) {
    console.log(error)
    process.exit(1)
  })
