'use strict'

var resolve = require('path').resolve
var normalize = require('path').normalize

module.exports = {
  auth: false,
  handler: {
    directory: {
      defaultExtension: 'html',
      path: normalize(resolve(__dirname, '../../www'))
    }
  }
}
