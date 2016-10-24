'use strict'

describe('[unit] CQRS campaignCreateWithCompanyCommand', function () {
  it('should mock (resolve)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignCreateWithCompanyCommand')
    done()
  })
  it('should mock (reject)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignCreateWithCompanyCommand')
    done()
  })
})
