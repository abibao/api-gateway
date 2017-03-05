'use strict'

const standard = require('mocha-standard')

describe('code style', function () {
  it('should be conforms to standard', standard.files([
    'index.js',
    'test-v3/**/*.js',
    'src-v3/**/*.js'
  ]))
})
