'use strict'

/*
{ method: 'GET', path: '/v1/alive', config: require('./handlers/alive') }
*/

var Promise = require('bluebird')

var chai = require('chai')
var expect = chai.expect

function inject (options) {
  return new Promise(function (resolve, reject) {
    global.ABIBAO.services.server.inject(options, resolve)
  })
}

describe('[unit] alive route', function () {
  it('should be alive', function (done) {
    inject({
      method: 'GET',
      url: '/v1/alive'
    })
      .then(function (response) {
        expect(response).to.be.an('object')
        expect(response.statusCode).to.be.a('number')
        expect(response.statusCode).to.equal(200)
        done()
      })
      .catch(done)
  })
})
