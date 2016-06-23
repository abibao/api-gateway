'use strict'

var chai = require('chai')
var expect = chai.expect
var async = require('async')

var engine = require('../src/engine')

describe('abibao story', function () {
  it('should initialize global.ABIBAO', function (done) {
    engine()
      .then(function () {
        expect(global.ABIBAO.uuid).to.be.a('string')
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should execute dictionnary', function (done) {
    async.mapLimit(global.ABIBAO.services.domain.dictionnary, 1, function (item, next) {
      global.ABIBAO.services.domain[item]()
        .then(function (result) {
          next()
        })
        .catch(function (error) {
          next()
        })
    }, function () {
      done()
    })
  })
})
