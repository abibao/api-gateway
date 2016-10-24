'use strict'

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
