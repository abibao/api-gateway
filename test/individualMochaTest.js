'use strict'

var chai = require('chai')
var expect = chai.expect
var faker = require('faker')

var engine = require('../src/engine')
var individualFake = {}

describe('individual auto test', function () {
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
  it('should create', function (done) {
    it('should success create', function (done) {
      global.ABIBAO.services.domain.execute('command', 'individualCreateCommand', {})
        .then(function (created) {
          individualFake = created
          done()
        })
        .catch(function (error) {
          done(error)
        })
    })
  })
  it('should read', function (done) {
    done()
  })
  it('should update', function (done) {
    done()
  })
  it('should delete', function (done) {
    done()
  })
})
