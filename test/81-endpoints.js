/* global describe:false, it:false */
'use strict'

var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = chai.expect
var async = require('async')

var engine = require('../src/engine')

chai.use(chaiHttp)

describe('endpoints story', function () {
  it('should initialize global.ABIBAO', function (done) {
    if (global.ABIBAO.uuid) {
      done()
    } else {
      engine()
        .then(function () {
          expect(global.ABIBAO.uuid).to.be.a('string')
          done()
        })
        .catch(function (error) {
          done(error)
        })
    }
  })
  it('should mock all routes/handlers', function (done) {
    var tables = global.ABIBAO.services.server.table()
    var info = tables[0].info
    var routes = tables[0].table
    expect(tables).to.be.a('array')
    expect(info).to.have.property('uri')
    expect(routes).to.be.a('array')
    async.map(routes, function (route, next) {
      var method = route.method
      var path = route.path
      var baseapi = /v1/.test(path) === true
      if (baseapi) {
        var promise = chai.request(info.uri)[method]
        promise(path)
          .send()
          .end(function (err, res) {
            if (err) { return next(err) }
            expect(res).to.have.property('status')
            var request = {}
            request.params = {
              urn: 'urn'
            }
            request.payload = {}
            request.auth = {
              credentials: 'credentials'
            }
            route.settings.handler(request, next)
          })
      } else {
        next()
      }
    }, function () {
      done()
    })
  })
})
