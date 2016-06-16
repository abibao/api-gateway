'use strict'

var chai = require('chai')
var expect = chai.expect

var mocha = require('../src/mocha')

describe('abibao story', function () {
  it('should initialize global.ABIBAO', function (done) {
    mocha()
      .then(function () {
        expect(global.ABIBAO.uuid).to.be.a('string')
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
