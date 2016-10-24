'use strict'

describe('[unit] CQRS administratorCreateAuthTokenCommand', function () {
  it('should mock (resolve)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorCreateAuthTokenCommand')
    done()
  })
  it('should mock (reject)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorCreateAuthTokenCommand')
    done()
  })
})
