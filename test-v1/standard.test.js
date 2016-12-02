'use strict'

const standard = require('mocha-standard')

describe('code style', function () {
  it('should be conforms to standard', standard.files([
    'index.js',
    'test/**/*.js',
    'src/engine.js',
    'src/services.js',
    'src/index.js',
    'src/bus/**/*.js',
    'src/domain/**/*.js',
    'src/server/**/*.js',
    'bin/**/*.js',
    'tools/**/*.js'
  ]))
})
