'use strict'

var chai = require('chai')
var expect = chai.expect

describe('engine structure', function () {
  it('should initialize global.ABIBAO', function (done) {
    require('../src/engine')()
      .then(function () {
        expect(global.ABIBAO.uuid).to.be.a('string')
        setTimeout(() => {
          done()
        }, 1000)
      })
      .catch(done)
  })
  it('should test the creation of an urn and the reversing', function (done) {
    var urn = global.ABIBAO.services.domain.getURNfromID('1234567890', 'npmtest')
    expect(urn).to.be.a('string')
    var id = global.ABIBAO.services.domain.getIDfromURN(urn)
    expect(id).to.be.a('string').to.be.eq('1234567890')
    done()
  })
})
