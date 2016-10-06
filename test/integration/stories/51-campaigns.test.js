/* global describe:false, it:false */
'use strict'

var chai = require('chai')

var campaignFake = {}

describe('[integration] handlers/campaigns', function () {
  it('should success list', function (done) {
    global.ABIBAO.services.domain.execute('query', 'campaignFilterQuery', {})
      .then(function (campaigns) {
        campaignFake = campaigns[0]
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should success read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'campaignReadPopulateQuery', campaignFake.urn)
      .then(function (campaign) {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should success update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignUpdateCommand', {
      urn: campaignFake.urn,
      name: campaignFake.name
    })
      .then(function (campaign) {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
