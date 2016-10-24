'use strict'

/*
{ method: 'POST', path: '/v1/individuals/login', config: require('./handlers/individuals/login') },
*/

var Promise = require('bluebird')

var chai = require('chai')
var expect = chai.expect

function inject (options) {
  return new Promise(function (resolve, reject) {
    global.ABIBAO.services.server.inject(options, resolve)
  })
}

describe('[unit] dashboard/auth routes', function () {
  it('should not login (error 400)', function (done) {
    inject({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/login',
      payload: JSON.stringify({
        email: 'nobody@abibao.com',
        password: 'nobody'
      })
    })
      .then(function (response) {
        expect(response).to.be.an('object')
        expect(response.statusCode).to.be.a('number')
        expect(response.statusCode).to.equal(400)
        done()
      })
      .catch(done)
  })
})
