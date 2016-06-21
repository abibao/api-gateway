'use strict'

var chai = require('chai')
var should = chai.should()
var expect = chai.expect

var engine = require('../src')

describe('sendgrid story', function () {
  it('should initialize global.ABIBAO', function (done) {
    if (global.ABIBAO) {
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
  it('should send a simple email with our api key', function (done) {
    var sendgrid = require('sendgrid').SendGrid(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))
    var request = sendgrid.emptyRequest()
    request.method = 'POST'
    request.path = '/v3/mail/send'
    request.body = {
      'personalizations': [
        {
          'to': [
            { 'email': 'gperreymond@gmail.com' }
          ],
          'subject': '[abibao-istanbul] This is test text from sendgrid'
        }
      ],
      'from': { 'email': 'bonjour@abibao.com', 'name': 'Abibao' },
      'content': [
        {
          'type': 'text',
          'value': 'If you receive this email, then tests are done without any error.'
        }
      ]
    }
    sendgrid.API(request, function (response) {
      expect(response.statusCode).to.equal(202)
      done()
    })
  })
  it('should succes individualSendEmailAbibaoAffectCampaignsAuto', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualSendEmailAbibaoAffectCampaignsAuto', {
      email: 'gperreymond@gmail.com',
      urnIndividual: 'individual.urn',
      urnCharity: 'message.urnCharity',
      urnCompany: 'message.urnCompany'
    }).then(function (result) {
      done()
    }).catch(function (error) {
      done(error)
    })
  })
})
