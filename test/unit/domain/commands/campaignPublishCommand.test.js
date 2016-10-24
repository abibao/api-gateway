'use strict'

describe('[unit] CQRS campaignPublishCommand', function () {
  it('should mock (resolve)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignPublishCommand')
    done()
  })
  it('should mock (reject)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignPublishCommand')
    done()
  })
})
