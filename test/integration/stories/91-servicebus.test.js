'use strict'

var chai = require('chai')
var expect = chai.expect

var analyticsComputeAnswer = require('../../../src/bus/handlers/analytics_compute_answer')
var analyticsComputeUser = require('../../../src/bus/handlers/analytics_compute_user')
var webhookSlack = require('../../../src/bus/handlers/webhook_slack')

describe('[integration] servicebus story', function () {
  it('should simulate and fail BUS_EVENT_ANALYTICS_COMPUTE_ANSWER', function (done) {
    analyticsComputeAnswer({
      survey: '5728fc583dea810500da78d6',
      label: 'ABIBAO_ANSWER_FONDAMENTAL_AGE',
      answer: '1970',
      isURN: false
    })
    .then(() => {
      done(new Error('then is not prossible...'))
    })
    .catch((error) => {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should simulate and fail BUS_EVENT_ANALYTICS_COMPUTE_USER', function (done) {
    analyticsComputeUser({})
    done()
  })
  it('should send BUS_EVENT_WEBHOOK_SLACK', function (done) {
    webhookSlack({
      text: '[' + new Date() + '] - mocha has just send message to slack',
      webhook: global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SLACK_WEBHOOK')
    })
    done()
  })
})
