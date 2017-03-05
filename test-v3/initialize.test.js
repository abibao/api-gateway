'use strict'

const path = require('path')
const fse = require('fs-extra')

describe('initialize test', function () {
  it('should prepare databases directory', function (done) {
    const dirpath = path.resolve(__dirname, 'databases')
    fse.ensureDirSync(dirpath)
    fse.emptyDirSync(dirpath)
    done()
  })
})
