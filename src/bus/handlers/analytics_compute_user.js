'use strict'

var Promise = require('bluebird')

module.exports = function (individual) {
  return new Promise(function (resolve, reject) {
    global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_USER email=%s', individual.email)
    global.ABIBAO.services.domain.execute('command', 'analyticsComputeUserCommand', individual)
      .then(resolve)
      .catch(reject)
  })
}
