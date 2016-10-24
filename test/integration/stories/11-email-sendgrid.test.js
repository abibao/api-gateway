'use strict'

var chai = require('chai')
var expect = chai.expect

describe('[integration] sendgrid story', function () {
  it('should send a simple email with our api key', function (done) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 162b2639c3f2554f3565681b12f873c7e8d7d424
    })
    sg.API(request)
      .then(response => {
        expect(response.statusCode).to.equal(202)
        done()
      })
      .catch(done)
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
