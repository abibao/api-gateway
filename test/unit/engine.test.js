'use strict'

var chai = require('chai')
var expect = chai.expect

var engine = require('../../src/engine')

describe('[unit] start global engine', function () {
  it('should initialize global.ABIBAO', function (done) {
    if (global.ABIBAO.running === true) {
      done()
    } else {
      engine()
        .then(function () {
          expect(global.ABIBAO.uuid).to.be.a('string')
          expect(global.ABIBAO.running).to.be.eq(true)
          done()
        })
        .catch(done)
    }
  })
})
