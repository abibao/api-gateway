/*global describe:false, it:false*/
'use strict'

var chai = require('chai')
var expect = chai.expect
var faker = require('faker')

var individualFake = {
  email: faker.internet.email().toLowerCase(),
  scope: 'tests'
}

var engine = require('../src/engine')

describe('autologin individual', function () {
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
  it('should create individual', function (done) {
    global.ABIBAO.services.server.service('individuals').create(individualFake)
      .then(function (individual) {
        individualFake.id = individual.id
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should create an autologin fingerprint', function (done) {
    individualFake.backUrl = 'http://localhost/#autologin?fingerprint'
    global.ABIBAO.services.server.service('autologin').create(individualFake)
      .then(function (fingerprint) {
        expect(fingerprint).to.be.not.null
        expect(fingerprint).to.be.a('string')
        individualFake.fingerprint = fingerprint
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should load an autologin fingerprint', function (done) {
    global.ABIBAO.services.server.service('autologin').get(individualFake.fingerprint)
      .then(function (result) {
        expect(result).to.be.not.null
        expect(result).to.be.an('object')
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete individual', function (done) {
    global.ABIBAO.services.server.service('individuals').remove(individualFake.id)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
