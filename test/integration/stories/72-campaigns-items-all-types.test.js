'use strict'

var chai = require('chai')
var chaiHttp = require('chai-http')
var faker = require('faker')

chai.use(chaiHttp)

var campaignFake = {}
var campaignItemFake = {}

describe('[integration] handlers/campaigns-items-all-types', function () {
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
  // DROPDOWN
  it('should create componentDropdown with fake data', function (done) {
    campaignItemFake = {
      campaign: campaignFake.urn,
      label: faker.lorem.sentence()
    }
    global.ABIBAO.services.domain.execute('command', 'campaignItemDropdownCreateCommand', campaignItemFake)
      .then(function (item) {
        campaignItemFake = item
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete last created componentDropdown', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemDeleteCommand', campaignItemFake.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  // LONG TEXT
  it('should create componentLongText with fake data', function (done) {
    campaignItemFake = {
      campaign: campaignFake.urn,
      label: faker.lorem.sentence()
    }
    global.ABIBAO.services.domain.execute('command', 'campaignItemLongTextCreateCommand', campaignItemFake)
      .then(function (item) {
        campaignItemFake = item
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete last created componentLongText', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemDeleteCommand', campaignItemFake.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should create componentMultipleChoice with fake data', function (done) {
    campaignItemFake = {
      campaign: campaignFake.urn,
      label: faker.lorem.sentence()
    }
    global.ABIBAO.services.domain.execute('command', 'campaignItemMultipleChoiceCreateCommand', campaignItemFake)
      .then(function (item) {
        campaignItemFake = item
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete last created componentMultipleChoice', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemDeleteCommand', campaignItemFake.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should create componentNumber with fake data', function (done) {
    campaignItemFake = {
      campaign: campaignFake.urn,
      label: faker.lorem.sentence()
    }
    global.ABIBAO.services.domain.execute('command', 'campaignItemNumberCreateCommand', campaignItemFake)
      .then(function (item) {
        campaignItemFake = item
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete last created componentNumber', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemDeleteCommand', campaignItemFake.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should create componentShortText with fake data', function (done) {
    campaignItemFake = {
      campaign: campaignFake.urn,
      label: faker.lorem.sentence()
    }
    global.ABIBAO.services.domain.execute('command', 'campaignItemShortTextCreateCommand', campaignItemFake)
      .then(function (item) {
        campaignItemFake = item
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete last created componentShortText', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemDeleteCommand', campaignItemFake.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should create componentYesNo with fake data', function (done) {
    campaignItemFake = {
      campaign: campaignFake.urn,
      label: faker.lorem.sentence()
    }
    global.ABIBAO.services.domain.execute('command', 'campaignItemYesNoCreateCommand', campaignItemFake)
      .then(function (item) {
        campaignItemFake = item
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete last created componentYesNo', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemDeleteCommand', campaignItemFake.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should create componentStatement with fake data', function (done) {
    campaignItemFake = {
      campaign: campaignFake.urn,
      label: faker.lorem.sentence()
    }
    global.ABIBAO.services.domain.execute('command', 'campaignItemStatementCreateCommand', campaignItemFake)
      .then(function (item) {
        campaignItemFake = item
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete last created componentStatement', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemDeleteCommand', campaignItemFake.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should create componentLongText with fake data', function (done) {
    campaignItemFake = {
      campaign: campaignFake.urn,
      label: faker.lorem.sentence()
    }
    global.ABIBAO.services.domain.execute('command', 'campaignItemLongTextCreateCommand', campaignItemFake)
      .then(function (item) {
        campaignItemFake = item
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete last created componentLongText', function (done) {
    global.ABIBAO.services.domain.execute('command', 'campaignItemDeleteCommand', campaignItemFake.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
