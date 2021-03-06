'use strict'

// use new relic agent
require('newrelic')

var engine = require('./engine')

engine()
  .then(function () {
    global.ABIBAO.debuggers.application('engine is running')
    setTimeout(() => {
      global.ABIBAO.services.bus.publish(global.ABIBAO.events.BusEvent.BUS_EVENT_IS_ALIVE, {
        name: global.ABIBAO.name,
        uuid: global.ABIBAO.uuid,
        message: 'has just connected into the bus'
      }, {type: 'fanout', exchangeName: 'amq.fanout'})
    }, 2000)
  })
  .catch(function (error) {
    global.ABIBAO.debuggers.error('engine is not running')
    console.log(error)
    process.exit(1)
  })
