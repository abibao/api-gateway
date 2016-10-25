'use strict'

var Promise = require('bluebird')

var chai = require('chai')
var expect = chai.expect
var stub = require('sinon').stub

function inject (options) {
  return new Promise(function (resolve, reject) {
    global.ABIBAO.services.server.inject(options, resolve)
  })
}

before(function (done) {
  Promise.all([
    require('../../../../../mock-abibao').server(),
    require('../../../../../mock-abibao').domain()
  ]).then(() => {
    done()
  })
})

describe.only('[unit] server administrators login', function () {
  it('should not register (error 401)', function (done) {
    inject({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/administrators/register'
    })
      .then(function (response) {
        expect(response).to.be.an('object')
        expect(response.statusCode).to.be.a('number')
        expect(response.statusCode).to.equal(401)
        done()
      })
      .catch(done)
  })
  it('should not login because no credentials', function (done) {
    var handler = stub(global.ABIBAO.services.domain, 'administratorLoginWithCredentialsCommand')
    handler.returns(1)
    console.log(global.ABIBAO.services.domain.execute)
    inject({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/administrators/login'
    })
      .then(function (response) {
        expect(response).to.be.an('object')
        expect(response.statusCode).to.be.a('number')
        expect(response.statusCode).to.equal(400)
        done()
      })
      .catch(done)
  })
  it('should not login because false credentials', function (done) {
    inject({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/administrators/login',
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
