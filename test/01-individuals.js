/*global describe:false, it:false*/
'use strict'

const chai = require('chai')
const expect = chai.expect
const faker = require('faker')

const engine = require('../src/engine')

let individualFake = {
  email: faker.internet.email().toLowerCase(),
  scope: 'test'
}

describe('abibao story', function () {
  it('should initialize global.ABIBAO on port ' + global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_EXPOSE_PORT'), function (done) {
    if (global.ABIBAO.uuid) {
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
  /*it('should find all individuals', function (done) {
    const service = global.ABIBAO.services.server.service('individuals')
    expect(service).to.be.not.null
    expect(service).to.be.an('object')
    service.find({ query: {} })
      .then(function (result) {
        expect(result).to.be.not.null
        expect(result).to.have.property('total')
        expect(result).to.have.property('skip')
        expect(result).to.have.property('limit')
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should not create individual because email is null', function (done) {
    const service = global.ABIBAO.services.server.service('individuals')
    expect(service).to.be.not.null
    expect(service).to.be.an('object')
    service.create({email: null})
      .catch(function (error) {
        expect(error).to.be.not.null
        expect(error).to.have.property('type')
        expect(error.type).to.be.equal('FeathersError')
        expect(error).to.have.property('code')
        expect(error.code).to.be.equal(400)
        done()
      })
  })
  it('should not create individual because email is not valid', function (done) {
    const service = global.ABIBAO.services.server.service('individuals')
    expect(service).to.be.not.null
    expect(service).to.be.an('object')
    service.create({email: 'a'})
      .catch(function (error) {
        expect(error).to.be.not.null
        expect(error).to.have.property('type')
        expect(error.type).to.be.equal('FeathersError')
        expect(error).to.have.property('code')
        expect(error.code).to.be.equal(400)
        done()
      })
  })*/
  it('should create individual', function (done) {
    const service = global.ABIBAO.services.server.service('/v1/individuals')
    expect(service).to.be.not.null
    expect(service).to.be.an('object')
    service.create(individualFake)
      .then(function (result) {
        expect(result).to.be.not.null
        expect(result).to.have.property('urn')
        expect(result).to.have.property('email')
        expect(result).to.have.property('charity')
        expect(result).to.have.property('scope')
        expect(result.scope).to.be.equal('test')
        individualFake = result
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
/*it('should update individual', function (done) {
  const service = global.ABIBAO.services.server.service('individuals')
  expect(service).to.be.not.null
  expect(service).to.be.an('object')
  service.update(individualFake.urn, {email: faker.internet.email().toLowerCase()})
    .then(function (result) {
      console.log(result)
      done()
    })
    .catch(function (error) {
      done(error)
    })
})
it('should remove individual', function (done) {
  const service = global.ABIBAO.services.server.service('individuals')
  expect(service).to.be.not.null
  expect(service).to.be.an('object')
  service.remove(individualFake.urn)
    .then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.have.property('urn')
      expect(result).to.have.property('email')
      expect(result).to.have.property('charity')
      expect(result).to.have.property('scope')
      expect(result.scope).to.be.equal('test')
      done()
    })
    .catch(function (error) {
      done(error)
    })
})*/
})
