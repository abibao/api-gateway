'use strict'

var Promise = require('bluebird')
var Querystring = require('querystring')
var Boom = require('boom')

var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect

before(function (done) {
  Promise.all([
    require('../../../../../mock-abibao').server(),
    require('../../../../../mock-abibao').domain()
  ]).then(() => {
    done()
  })
})

var stub

describe('[unit] server /v1/administrators/login', function () {
  it('should not login because email is mandatory', function (done) {
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/administrators/login'
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('child "email" fails because ["email" is required]')
      done()
    })
  })
  it('should not login because email has not a valid format', function (done) {
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/administrators/login',
      payload: Querystring.stringify({
        email: 'nobody'
      })
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('child "email" fails because ["email" must be a valid email]')
      done()
    })
  })
  it('should not login because password is mandatory', function (done) {
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/administrators/login',
      payload: Querystring.stringify({
        email: 'nobody@abibao.com'
      })
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('child "password" fails because ["password" is required]')
      done()
    })
  })
  it('should not login and return a boom error', function (done) {
    stub = sinon.stub(global.ABIBAO.services.domain, 'execute', function (type, promise, params) {
      return new Promise(function (resolve, reject) {
        reject(Boom.badRequest())
      })
    })
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/administrators/login',
      payload: Querystring.stringify({
        email: 'nobody@abibao.com',
        password: 'pass4nobody'
      })
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('Error: Bad Request')
      stub.restore()
      done()
    })
  })
  it('should login', function (done) {
    stub = sinon.stub(global.ABIBAO.services.domain, 'execute', function (type, promise, params) {
      return new Promise(function (resolve, reject) {
        resolve({
          email: params.email
        })
      })
    })
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/administrators/login',
      payload: Querystring.stringify({
        email: 'nobody@abibao.com',
        password: 'pass4nobody'
      })
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.statusCode).to.be.a('number').to.equal(200)
      expect(res.result.email).to.be.a('string').to.equal('nobody@abibao.com')
      stub.restore()
      done()
    })
  })
})
