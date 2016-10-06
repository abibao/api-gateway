/* global describe:false, it:false */
'use strict'

var chai = require('chai')

var campaignFake = {}
var campaignItemFake = {}

describe('[integration] handlers/campaigns-items', function () {
  it('should success get campaign (prepare)', function (done) {
    global.ABIBAO.services.domain.execute('query', 'campaignFilterQuery', {})
      .then(function (campaigns) {
        campaignFake = campaigns[0]
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should success read populate', function (done) {
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
  it('should success read populate item', function (done) {
    global.ABIBAO.services.domain.execute('query', 'campaignItemReadPopulateQuery', campaignItemFake.urn)
      .then(function (item) {
        campaignItemFake = item
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should success update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemUpdateCommand', {
      urn: campaignItemFake.urn,
      label: campaignItemFake.label
    })
      .then(function (item) {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
