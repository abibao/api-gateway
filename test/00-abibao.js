/* global describe:false, it:false, before: false */
'use strict'

var chai = require('chai')
var expect = chai.expect
var glob = require('glob')
var path = require('path')
var _ = require('lodash')

var engine = require('../src/engine')

describe('abibao story', function () {
  before(function () {
    var patternPath = path.resolve(__dirname, '../src/server/handlers')
    patternPath += '/**/*.js'
    var patternFiles = glob.sync(patternPath, {
      nodir: true,
      dot: true,
      ignore: ['index.js']
    })
    _.map(patternFiles, function (filepath) {})
  })

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
})
