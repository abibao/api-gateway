'use strict'

const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect

const Boom = require('boom')

const engine = require('../../../engine.mock')
const Server = require('../../../../src-v3/lib/Server')
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

describe('[unit] server: /v1/alive', function () {
  it('should be alive', function (done) {
    const req = {
      method: 'GET',
      url: '/v1/alive'
    }
    server.hapi.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.statusCode).to.be.a('number').to.equal(200)
      done()
    })
  })
  it('should be not alive', function (done) {
    let stub = sinon.stub(server.hapi.methods, 'query', function (name, params = {}) {
      return new Promise((resolve, reject) => {
        reject(Boom.badRequest())
      })
    })
    const req = {
      method: 'GET',
      url: '/v1/alive'
    }
    server.hapi.inject(req, res => {
      stub.restore()
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.statusCode).to.be.a('number').to.equal(400)
      done()
    })
  })
})
