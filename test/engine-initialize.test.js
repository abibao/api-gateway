'use strict'

var chai = require('chai')
var expect = chai.expect
var engine = require('../src/engine')

describe('engine structure', function () {
  it('should initialize global.ABIBAO', function (done) {
    engine()
      .then(function () {
        expect(global.ABIBAO.uuid).to.be.a('string')
        done()
      })
      .catch(function (error) {
        console.log(error)
        done(error)
      })
  })
  it('should test the creation of an urn and the reversing', function (done) {
    var urn = global.ABIBAO.services.domain.getURNfromID('1234567890', 'npmtest')
    expect(urn).to.be.a('string')
    var id = global.ABIBAO.services.domain.getIDfromURN(urn)
    expect(id).to.be.a('string').to.be.eq('1234567890')
    done()
  })
})
