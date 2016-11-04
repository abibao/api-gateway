'use strict'

var _ = require('lodash')

module.exports = function (message) {
  global.ABIBAO.debuggers.bus('BUS_EVENT_SENDGRID_CRON_BOUNCES message=%o', message)
  global.ABIBAO.services.domain.execute('query', 'sendgridListAllEmailsBouncesQuery')
    .then((result) => {
      _.map(result.data, (email) => {
        global.ABIBAO.services.bus.publish(global.ABIBAO.events.BusEvent.BUS_EVENT_SENDGRID_CREATE_BOUNCE_HISTORY, {email})
      })
    })
}
