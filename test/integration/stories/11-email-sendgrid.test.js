/* global describe:false, it:false */
'use strict'

var chai = require('chai')
var expect = chai.expect

describe('[integration] sendgrid story', function () {
  it('should send a simple email with our api key', function (done) {
    var sg = require('sendgrid')(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
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
    })
    sg.API(request)
      .then(response => {
        expect(response.statusCode).to.equal(202)
        done()
      })
      .catch(done)
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
