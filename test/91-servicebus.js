/* global describe:false, it:false */
'use strict'

var chai = require('chai')
var expect = chai.expect

var engine = require('../src/engine')
var webhookSlack = require('../src/bus/handlers/webhook_slack')
var analyticsComputeAnswer = require('../src/bus/handlers/analytics_compute_answer')

describe('servicebus story', function () {
  it('should initialize global.ABIBAO', function (done) {
    if (global.ABIBAO.uuid) {
      done()
    } else {
      engine()
        .then(function () {
          expect(global.ABIBAO.uuid).to.be.a('string')
          done()
        })
        .catch(function (error) {
          done(error)
        })
    }
  })
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
    analyticsComputeAnswer({})
    done()
  })
})
