'use strict'

const chai = require('chai')
const expect = chai.expect

const engine = require('../../../engine.mock')
const Domain = require('../../../../src-v3/lib/Domain')
let domain = false

before(function (done) {
  engine.initialize()
    .then(() => {
      domain = new Domain(engine)
      return domain.initialize().then(() => {
        done()
      })
    })
    .catch(done)
})

describe('[unit] domain: IndividualRegisterCommand', function () {
  it('should not create individual because password1 != password2', function (done) {
    const payload = {
      email: 'gperreymond@gmail.com',
      password1: 'test1234',
      password2: '1234test',
      entity: 'urn:abibao:database:entity:ffd7dd87c544f29f0d9fbf70ceebb8d1a6949bd6ce3b4c65',
      survey: 'urn:abibao:database:survey:ffd7dd87c544f29f0d9fbf70ceebb8d1a6949bd6ce3b4c65',
      source: 'test unit'
    }
    domain.execute('Command', 'IndividualRegisterCommand', payload)
      .catch((error) => {
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('gateway-domain')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('service_error')
        expect(error['gateway-domain']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        expect(error.details).to.have.property('type')
        expect(error.details).to.have.property('name')
        expect(error.details.type).to.eq('Command.Error')
        expect(error.details.name).to.eq('IndividualRegisterCommand')
        expect(error.details.error.toString()).to.eq('Error: Passwords verication failed')
        done()
      })
  })
  it('should success create a complex individual', function (done) {
    const payload = {
      email: 'gperreymond@gmail.com',
      password1: 'test1234',
      password2: 'test1234',
      entity: 'urn:abibao:database:entity:ffd7dd87c544f29f0d9fbf70ceebb8d1a6949bd6ce3b4c65',
      survey: 'urn:abibao:database:survey:ffd7dd87c544f29f0d9fbf70ceebb8d1a6949bd6ce3b4c65',
      source: 'test unit'
    }
    domain.execute('Command', 'IndividualRegisterCommand', payload)
      .then((result) => {
        expect(result).to.be.an('object')
        done()
      })
      .catch((error) => {
        console.log(error)
        done(error)
      })
  })
  it('should success create a simple individual', function (done) {
    const payload = {
      email: 'gilles@abibao.com',
      password1: 'test1234',
      password2: 'test1234'
    }
    domain.execute('Command', 'IndividualRegisterCommand', payload)
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result.result).to.be.an('object')
        expect(result.result.urn).to.be.a('string')
        expect(result.result.email).to.be.eq('gilles@abibao.com')
        done()
      })
      .catch(done)
  })
  it('should not create individual because email already in database', function (done) {
    const payload = {
      email: 'gperreymond@gmail.com',
      password1: 'test1234',
      password2: 'test1234',
      entity: 'urn:abibao:database:entity:ffd7dd87c544f29f0d9fbf70ceebb8d1a6949bd6ce3b4c65',
      survey: 'urn:abibao:database:survey:ffd7dd87c544f29f0d9fbf70ceebb8d1a6949bd6ce3b4c65',
      source: 'test unit'
    }
    domain.execute('Command', 'IndividualRegisterCommand', payload)
      .catch((error) => {
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('gateway-domain')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('service_error')
        expect(error['gateway-domain']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        expect(error.details).to.have.property('type')
        expect(error.details).to.have.property('name')
        expect(error.details.type).to.eq('Command.Error')
        expect(error.details.name).to.eq('IndividualRegisterCommand')
        expect(error.details.error.toString()).to.eq('Error: Email already exists in database')
        done()
      })
  })
})
