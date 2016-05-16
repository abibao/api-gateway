'use strict'

require('../src')

var chai = require('chai')
var should = chai.should()
var expect = chai.expect

var sendgrid = require('sendgrid')(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))

describe('sendgrid story', function () {
  it('should send a simple email with our api key', function (done) {
    sendgrid.send({
      to: ['gperreymond@gmail.com', 'boitaumail@gmail.com'],
      from: 'team@abibao.com',
      fromname: 'Team Abibao',
      subject: '[abibao-istanbul] This is test text from sendgrid',
      text: 'If you receive this email, then tests are done without any error.'
    }, function (error, json) {
      expect(error).to.be.null
      expect(json.message).to.equal('success')
      done()
    })
  })
})
