/*global describe:false, it:false*/
'use strict'

var chai = require('chai')
var expect = chai.expect

var engine = require('../src/engine')

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
})
