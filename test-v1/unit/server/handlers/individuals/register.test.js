'use strict'

var Promise = require('bluebird')
var Querystring = require('querystring')
var Boom = require('boom')

var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect

var stub

before(function (done) {
  Promise.all([
    require('../../../../mock-abibao').server(),
    require('../../../../mock-abibao').domain()
  ]).then(() => {
    done()
  })
})

describe('[unit] server: /v1/individuals/register', function () {
  it('should not register because email is mandatory', function (done) {
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/register'
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('child "email" fails because ["email" is required]')
      done()
    })
  })
  it('should not register because email has not a valid format', function (done) {
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/register',
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
  it('should not register because password is mandatory', function (done) {
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/register',
      payload: Querystring.stringify({
        email: 'nobody@abibao.com'
      })
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('child "password1" fails because ["password1" is required]')
      done()
    })
  })
  it('should not register because password verification is mandatory', function (done) {
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/register',
      payload: Querystring.stringify({
        email: 'nobody@abibao.com',
        password1: 'pass4nobody'
      })
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('child "password2" fails because ["password2" is required]')
      done()
    })
  })
  it('should not register because password verification failed', function (done) {
    stub = sinon.stub(global.ABIBAO.services.domain, 'execute', function (type, promise, params) {
      return new Promise(function (resolve, reject) {
        reject(Boom.badRequest(new Error('invalid password confimation')))
      })
    })
    var req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/register',
      payload: Querystring.stringify({
        email: 'nobody@abibao.com',
        password1: 'pass4nobody',
        password2: 'pass4someone'
      })
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('Error: Error: invalid password confimation')
      stub.restore()
      done()
    })
    it('should register', function (done) {
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
        url: '/v1/individuals/register',
        payload: Querystring.stringify({
          email: 'nobody@abibao.com',
          password1: 'pass4nobody',
          password2: 'pass4nobody'
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
})
