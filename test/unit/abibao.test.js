/* global describe:false, it:false */
'use strict'

var chai = require('chai')
var expect = chai.expect

var engine = require('../../src/engine')

describe('[unit] start engine', function () {
  it('should initialize global.ABIBAO', function (done) {
    engine()
      .then(function () {
        expect(global.ABIBAO.uuid).to.be.a('string')
        done()
      })
      .catch(done)
  })
})
