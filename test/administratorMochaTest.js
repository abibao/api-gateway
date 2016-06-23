'use strict'

var chai = require('chai')
var expect = chai.expect
var faker = require('faker')

var engine = require('../src/engine')
var administratorFake = {}

describe('administrator auto test', function () {
  it('should initialize global.ABIBAO', function (done) {
    if (global.ABIBAO) {
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
  it('should not create', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorCreateCommand', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'administratorReadQuery', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorUpdateCommand', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorDeleteCommand', {})
      .catch(function (error) {
        done()
      })
  })
})
