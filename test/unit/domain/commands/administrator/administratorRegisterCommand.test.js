'use strict'

describe('[unit] CQRS administratorRegisterCommand', function () {
  it('should mock (resolve)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorRegisterCommand')
    done()
  })
  it('should mock (reject)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorRegisterCommand')
    done()
  })
})
