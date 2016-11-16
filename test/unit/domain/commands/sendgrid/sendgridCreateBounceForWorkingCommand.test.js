'use strict'

var chai = require('chai')
var expect = chai.expect

var command = require('../../../../../src/domain/commands/sendgrid/sendgridCreateBounceForWorkingCommand')

describe('[unit] domain: sendgridCreateBounceForWorkingCommand', function () {
  it('should fail on payload validation, rethinkdb mandatory', function (done) {
    command()
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "rethinkdb" fails because ["rethinkdb" is required]')
        done()
      })
  })
  it('should fail on payload validation, rethinkdb has to be a string', function (done) {
    command({
      rethinkdb: 10
    })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "rethinkdb" fails because ["rethinkdb" must be a string]')
        done()
      })
  })
  it('should fail on payload validation, email mandatory', function (done) {
    command({
      rethinkdb: 'id_from_rethinkdb'
    })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "email" fails because ["email" is required]')
        done()
      })
  })
  it('should fail on payload validation, email has to be a valid email', function (done) {
    command({
      rethinkdb: 'id_from_rethinkdb',
      email: 'nobody'
    })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "email" fails because ["email" must be a valid email]')
        done()
      })
  })
  it('should fail on payload validation, created mandatory', function (done) {
    command({
      rethinkdb: 'id_from_rethinkdb',
      email: 'nobody@test.com'
    })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "created" fails because ["created" is required]')
        done()
      })
  })
  it('should fail on payload validation, created has to be a number', function (done) {
    command({
      rethinkdb: 'id_from_rethinkdb',
      email: 'nobody@test.com',
      created: true
    })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "created" fails because ["created" must be a number]')
        done()
      })
  })
  it('should fail on payload validation, reason mandatory', function (done) {
    command({
      rethinkdb: 'id_from_rethinkdb',
      email: 'nobody@test.com',
      created: Date.now()
    })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "reason" fails because ["reason" is required]')
        done()
      })
  })
  it('should fail on payload validation, reason has to be a string', function (done) {
    command({
      rethinkdb: 'id_from_rethinkdb',
      email: 'nobody@test.com',
      created: Date.now(),
      reason: true
    })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "reason" fails because ["reason" must be a string]')
        done()
      })
  })
  it('should fail on payload validation, status mandatory', function (done) {
    command({
      rethinkdb: 'id_from_rethinkdb',
      email: 'nobody@test.com',
      created: Date.now(),
      reason: 'string'
    })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "status" fails because ["status" is required]')
        done()
      })
  })
  it('should fail on payload validation, status has to be a string', function (done) {
    command({
      rethinkdb: 'id_from_rethinkdb',
      email: 'nobody@test.com',
      created: Date.now(),
      reason: 'string',
      status: false
    })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error.eraro).to.be.eq(true)
        expect(error.code).to.be.eq('joi_validation_payload')
        expect(error.details).to.be.an('object')
        expect(error.details.type).to.be.eq('Command')
        expect(error.details.name).to.be.eq('SendgridCreateBounceForWorkingCommand')
        expect(error.details.error.toString()).to.be.eq('ValidationError: child "status" fails because ["status" must be a string]')
        done()
      })
  })
  it('should success', function (done) {
    command({
      rethinkdb: 'anne.simon@ca-fnca.fr::1476176559',
      created: 1476176559,
      email: 'anne.simon@ca-fnca.fr',
      reason: '5.1.0 - Unknown address error 550-\'#5.1.0 Address rejected.\' (delivery attempts: 0)',
      status: '5.0.0'
    })
      .then((result) => {
        done()
      })
      .catch((error) => {
        done(error)
      })
  })
})
