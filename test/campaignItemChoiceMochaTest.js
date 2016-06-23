'use strict'

var chai = require('chai')
var expect = chai.expect
var faker = require('faker')

var engine = require('../src/engine')
var campaignitemchoiceFake = {}

describe('campaignitemchoice auto test', function () {
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
    global.ABIBAO.services.domain.execute('command', 'campaignItemChoiceCreateCommand', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'campaignItemChoiceReadQuery', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemChoiceUpdateCommand', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemChoiceDeleteCommand', {})
      .catch(function (error) {
        done()
      })
  })
})
