/* global describe:false, it:false */
'use strict'

var chai = require('chai')

describe('[unit] CQRS campaignItemChoiceCreateWithCampaignAssignCommand', function () {
  it('should mock (resolve)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemChoiceCreateWithCampaignAssignCommand')
    done()
  })
  it('should mock (reject)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemChoiceCreateWithCampaignAssignCommand')
    done()
  })
})
