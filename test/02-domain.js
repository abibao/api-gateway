'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

var chai = require('chai')
var should = chai.should()
var expect = chai.expect

var Services = require('./../src/services')
var domain

describe('domain story', function () {
  it('should initialize', function (done) {
    domain = Services.domain()
    Services.startDomain(function (error) {
      expect(error).to.be.null
      done()
    })
  })
})
