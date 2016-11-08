'use strict'

module.exports = function (message) {
  global.ABIBAO.debuggers.bus('BUS_EVENT_SENDGRID_CREATE_BOUNCE_WORKING message=%o', message)
  global.ABIBAO.services.domain.execute('command', 'sendgridCreateBounceForWorkingCommand', message)
}
