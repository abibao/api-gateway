'use strict'

const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect

const Querystring = require('querystring')

const engine = require('../../../../engine.mock')
const Server = require('../../../../../src-v3/lib/Server')
let server = false

before(function (done) {
  engine.initialize()
    .then(() => {
      server = new Server(engine)
      return server.initialize().then(() => {
        done()
      })
    })
    .catch(done)
})

describe('[unit] server: /v1/individuals/login', function () {
  it('should not login because email is mandatory', function (done) {
    const req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/login'
    }
    server.hapi.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('child "email" fails because ["email" is required]')
      done()
    })
  })
  it('should not login because email has not a valid format', function (done) {
    const req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/login',
      payload: Querystring.stringify({
        email: 'nobody'
      })
    }
    server.hapi.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('child "email" fails because ["email" must be a valid email]')
      done()
    })
  })
  it('should not login because password is mandatory', function (done) {
    const req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/login',
      payload: Querystring.stringify({
        email: 'nobody@abibao.com'
      })
    }
    server.hapi.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('child "password" fails because ["password" is required]')
      done()
    })
  })
  it('should not login and return a boom error', function (done) {
    let stub = sinon.stub(server.hapi.methods, 'command', function (name, params = {}) {
      return new Promise(function (resolve, reject) {
        reject('ERROR_BAD_AUTHENTIFICATION')
      })
    })
    const req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/login',
      payload: Querystring.stringify({
        email: 'nobody@abibao.com',
        password: 'pass4nobody'
      })
    }
    server.hapi.inject(req, res => {
      stub.restore()
      console.log(res.result)
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.result.statusCode).to.be.a('number').to.equal(400)
      expect(res.result.message).to.be.a('string').to.equal('Error: Bad Request')
      done()
    })
  })
  it('should login', function (done) {
    let stub = sinon.stub(server.hapi.methods, 'command', function (name, params = {}) {
      return new Promise(function (resolve, reject) {
        resolve({
          email: params.email
        })
      })
    })
    const req = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      url: '/v1/individuals/login',
      payload: Querystring.stringify({
        email: 'nobody@abibao.com',
        password: 'pass4nobody'
      })
    }
    server.hapi.inject(req, res => {
      stub.restore()
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.statusCode).to.be.a('number').to.equal(200)
      expect(res.result.email).to.be.a('string').to.equal('nobody@abibao.com')
      done()
    })
  })
})
