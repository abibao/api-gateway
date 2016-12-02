'use strict'

var chai = require('chai')
var expect = chai.expect

var data = null

describe('[integration] entity auto test', function () {
  it('should initialize fake data', function (done) {
    expect(global.ABIBAO.uuid).to.be.a('string')
    expect(global.ABIBAO.services.domain.EntityModel).to.be.not.undefined
    expect(global.ABIBAO.services.domain.EntityModel).to.be.not.null
    var Model = global.ABIBAO.services.domain.EntityModel
    data = new Model({}).getFakeData()
    done()
  })
  it('should create', function (done) {
    global.ABIBAO.services.domain.execute('command', 'entityCreateCommand', data)
      .then(function (create) {
        data = create
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'entityReadQuery', data.urn)
      .then(function (read) {
        data = read
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'entityUpdateCommand', data)
      .then(function (update) {
        data = update
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'entityDeleteCommand', data.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should not create', function (done) {
    global.ABIBAO.services.domain.execute('command', 'entityCreateCommand', {})
      .catch(function () {
        done()
      })
  })
  it('should not read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'entityReadQuery', {})
      .catch(function () {
        done()
      })
  })
  it('should not update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'entityUpdateCommand', {})
      .catch(function () {
        done()
      })
  })
  it('should not delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'entityDeleteCommand', {})
      .catch(function () {
        done()
      })
  })
})
