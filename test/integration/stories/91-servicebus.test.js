/* global describe:false, it:false */
'use strict'

var chai = require('chai')
var expect = chai.expect

var webhookSlack = require('../../../src/bus/handlers/webhook_slack')
var analyticsComputeAnswer = require('../../../src/bus/handlers/analytics_compute_answer')
var analyticsComputeUser = require('../../../src/bus/handlers/analytics_compute_user')

describe('[integration] servicebus story', function () {
  it('should subscribe BUS_EVENT_IS_ALIVE', function (done) {
    global.ABIBAO.services.bus.publish(global.ABIBAO.events.BusEvent.BUS_EVENT_IS_ALIVE, {
      name: global.ABIBAO.name,
      uuid: global.ABIBAO.uuid,
      message: 'has just connected into the bus'
    })
    done()
  })
  it('should send BUS_EVENT_WEBHOOK_SLACK', function (done) {
    webhookSlack({
      text: '[' + new Date() + '] - mocha has just send message to slack',
      webhook: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
    })
    done()
  })
  it('should send BUS_EVENT_ANALYTICS_COMPUTE_ANSWER', function (done) {
    analyticsComputeAnswer({
      survey: '5728fc583dea810500da78d6',
      label: 'ABIBAO_ANSWER_FONDAMENTAL_AGE',
      answer: '1970',
      isURN: false
    }).then(done).catch(done)
  })
  it('should send BUS_EVENT_ANALYTICS_COMPUTE_USER', function (done) {
    global.ABIBAO.services.domain.execute('query', 'individualFilterQuery', {
      email: 'gperreymond@gmail.com'
    }).then(function (individuals) {
      return analyticsComputeUser(individuals[0]).then(done)
    }).catch(done)
  })
})
