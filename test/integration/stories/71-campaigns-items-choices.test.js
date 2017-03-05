'use strict'

var campaignFake = {}
var campaignItemFake = {}
var campaignItemChoiceFake = {}

describe('[integration] handlers/campaigns-items-choices', function () {
  it('should success get campaign (prepare)', function (done) {
    global.ABIBAO.services.domain.execute('query', 'campaignFilterQuery', {id: '56eb24cfe9b0fbf30250f8c7'})
      .then(function (campaigns) {
        campaignFake = campaigns[0]
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should success get campaign-item (prepare)', function (done) {
    global.ABIBAO.services.domain.execute('query', 'campaignReadPopulateQuery', campaignFake.urn)
      .then(function (campaign) {
        campaignFake = campaign
        campaignItemFake = campaignFake.items[0]
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should success get campaign-item-choice', function (done) {
    global.ABIBAO.services.domain.execute('query', 'campaignItemReadPopulateQuery', campaignItemFake.urn)
      .then(function (item) {
        campaignItemFake = item
        campaignItemChoiceFake = campaignItemFake.choices[0]
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should success read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'campaignItemChoiceReadQuery', campaignItemChoiceFake.urn)
      .then(function (choice) {
        campaignItemChoiceFake = choice
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should success update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemChoiceUpdateCommand', {
      urn: campaignItemChoiceFake.urn,
      prefix: campaignItemChoiceFake.prefix
    })
      .then(function (item) {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
