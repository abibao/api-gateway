'use strict'

module.exports = function (message) {
  global.ABIBAO.debuggers.bus('BUS_EVENT_IS_ALIVE %o', message)
}
