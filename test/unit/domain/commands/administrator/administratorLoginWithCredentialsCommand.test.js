/* global describe:false, it:false */
'use strict'

var chai = require('chai')

describe('[unit] CQRS administratorLoginWithCredentialsCommand', function () {
  it('should mock (resolve)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorLoginWithCredentialsCommand')
    done()
  })
  it('should mock (reject)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorLoginWithCredentialsCommand')
    done()
  })
})
