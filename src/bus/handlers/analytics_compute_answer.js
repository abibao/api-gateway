'use strict'

var Promise = require('bluebird')

module.exports = function (message) {
  return new Promise(function (resolve, reject) {
    global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_ANSWER message=%o', message)
    global.ABIBAO.services.domain.execute('command', 'analyticsComputeAnswerCommand', message)
      .then(resolve)
      .catch(reject)
  })
}
