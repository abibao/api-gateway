'use strict'

module.exports = function (message) {
  global.ABIBAO.debuggers.bus('BUS_EVENT_SENDGRID_CREATE_BOUNCE_HISTORY message=%o', message)
  global.ABIBAO.services.domain.execute('command', 'sendgridCreateBounceHistoryCommand', {email: message.email})
}
