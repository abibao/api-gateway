'use strict'

var chai = require('chai')
var expect = chai.expect

var command = require('../../../../../src/domain/commands/sendgrid/sendgridCreateBounceHistoryCommand')

describe('[unit] domain: sendgridCreateBounceHistoryCommand', function () {
  it('should fail on payload validation, email mandatory', function (done) {
    command()
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceHistoryCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "email" fails because ["email" is required]')
        done()
      })
  })
  it('should fail on payload validation, forbidden params', function (done) {
    command({apiKey: 'NOT_A_GOOD_ONE', email: 'nobody@test.com', forbidden: true})
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceHistoryCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: "forbidden" is not allowed')
        done()
      })
  })
  it('should fail when using a bad api_key for sendgrid', function (done) {
    command({apiKey: 'NOT_A_GOOD_ONE', email: 'nobody@test.com'})
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('bad_sendgrid_api_key')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceHistoryCommand')
        done()
      })
  })
  it('should success', function (done) {
    command({email: 'julie.nichols@essilor.com'})
      .then((result) => {
        done()
      })
      .catch((error) => {
        done(error)
      })
  })
})
