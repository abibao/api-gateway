'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

var chai = require('chai')
var should = chai.should()
var expect = chai.expect

var Domain = require('./modules/domain')

describe('domain story', function () {
  it('should initialize domain if not done yet', function (done) {
    if (!global.domain) {
      Domain.initialize()
        .then(function () {
          done()
        })
    } else {
      done()
    }
  })
})
