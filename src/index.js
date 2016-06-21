'use strict'

var engine = require('./engine')

engine()
  .then(function () {
    global.ABIBAO.debuggers.application('engine is running')
  })
  .catch(function (error) {
    global.ABIBAO.debuggers.error('engine is not running')
  })
