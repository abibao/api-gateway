'use strict'

var chai = require('chai')
var expect = chai.expect

var engine = require('../src/engine')
var data = null

describe('individual auto test', function () {
  it('should initialize global.ABIBAO', function (done) {
    if (global.ABIBAO.uuid) {
      done()
    } else {
      engine()
        .then(function () {
          expect(global.ABIBAO.uuid).to.be.a('string')
          done()
        })
        .catch(function (error) {
          done(error)
        })
    }
  })
  it('should initialize fake data', function (done) {
    expect(global.ABIBAO.uuid).to.be.a('string')
    expect(global.ABIBAO.services.domain.IndividualModel).to.be.not.undefined
    expect(global.ABIBAO.services.domain.IndividualModel).to.be.not.null
    var Model = global.ABIBAO.services.domain.IndividualModel
    data = new Model({}).getFakeData()
    done()
  })
  it('should create', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualCreateCommand', data)
      .then(function (create) {
        data = create
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'individualReadQuery', data.urn)
      .then(function (read) {
        data = read
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualUpdateCommand', data)
      .then(function (update) {
        data = update
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualDeleteCommand', data.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should not create', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualCreateCommand', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'individualReadQuery', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualUpdateCommand', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualDeleteCommand', {})
      .catch(function (error) {
        done()
      })
  })
})
