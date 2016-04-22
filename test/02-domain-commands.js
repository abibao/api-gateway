'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

var chai = require('chai')
var should = chai.should()
var expect = chai.expect

var Services = require('./../src/services')
var domain

describe('testing domain commands/system', function () {
  it('should initialize the domain', function (done) {
    domain = Services.domain()
    Services.startDomain(function (err) {
      expect(err).to.be.null
      done()
    })
  })
})
