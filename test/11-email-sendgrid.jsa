'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var fs = require('fs')
var path = require('path')

var sendgrid = require('sendgrid')(nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))

describe('sendgrid story', function () {
  it('should send a simple email', function (done) {
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
  it('should send a template email', function (done) {
    sendgrid.send({
      to: ['gperreymond@gmail.com', 'boitaumail@gmail.com'],
      from: 'team@abibao.com',
      fromname: 'Team Abibao',
      subject: '[abibao-istanbul] This is test html from sendgrid',
      html: fs.readFileSync(path.resolve(__dirname, '../src/_emails/template_register.html'))
    }, function (error, json) {
      expect(error).to.be.null
      expect(json.message).to.equal('success')
      done()
    })
  })
})
