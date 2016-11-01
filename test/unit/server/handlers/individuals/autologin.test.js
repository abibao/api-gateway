'use strict'

var Promise = require('bluebird')

var chai = require('chai')
var expect = chai.expect

before(function (done) {
  Promise.all([
    require('../../../../mock-abibao').server(),
    require('../../../../mock-abibao').domain()
  ]).then(() => {
    done()
  })
})

describe('[unit] server /v1/individuals/autologin/{fingerprint}', function () {
  it('should success', function (done) {
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/autologin/AAAAAAAAAAAAAA'
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.type).to.be.a('string').to.equal('command')
      expect(res.result.promise).to.be.a('string').to.equal('individualLoginWithFingerprintCommand')
      expect(res.result.params).to.be.a('string').to.equal('AAAAAAAAAAAAAA')
      done()
    })
  })
})
