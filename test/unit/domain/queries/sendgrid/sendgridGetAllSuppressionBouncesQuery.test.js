'use strict'

var chai = require('chai')
var expect = chai.expect

var command = require('../../../../../src/domain/queries/sendgrid/sendgridGetAllSuppressionBouncesQuery')

describe.only('[unit] domain: sendgridGetAllSuppressionBouncesQuery', function () {
  it('should fail on payload validation', function (done) {
    command({forbidden: true}).catch((error) => {
      expect(error).to.be.an('error')
      expect(error.eraro).to.be.eq(true)
      expect(error.code).to.be.eq('joi_validation_payload')
      expect(error.details).to.be.an('object')
      expect(error.details.type).to.be.eq('Query')
      expect(error.details.name).to.be.eq('SendgridGetAllSuppressionBouncesQuery')
      done()
    })
  })
  it('should fail when using a bad api_key for sendgrid', function (done) {
    command({apiKey: 'NOT_A_GOOD_ONE'})
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('bad_sendgrid_api_key')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Query')
        expect(error.details.name).to.be.eq('SendgridGetAllSuppressionBouncesQuery')
        done()
      })
  })
  it('should success', function (done) {
    command({})
      .then((result) => {
        done()
      })
  })
})
