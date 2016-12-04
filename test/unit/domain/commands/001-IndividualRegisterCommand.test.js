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
        expect(error).to.be.an('object')
        expect(error.error.message).to.be.a('string').to.equal('Passwords verication failed')
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
      .catch(done)
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
        expect(error).to.be.an('object')
        expect(error.error.message).to.be.a('string').to.equal('Email already exists in database')
        done()
      })
  })
})
