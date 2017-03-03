/* eslint-disable */
'use strict'

var chai = require('chai')
var expect = chai.expect

describe('[integration] sendgrid story', function () {
  it('should send a simple email with our api key', function (done) {
    var sendgrid = require('sendgrid')(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))
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
    sendgrid.API(request, function (error, response) {
      expect(error).to.be.null
      expect(response.statusCode).to.equal(202)
      done()
    })
  })
  it('should success individualSendEmailAbibaoAffectCampaignsAuto', function (done) {
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
