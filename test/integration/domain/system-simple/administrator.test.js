/* eslint-disable */
'use strict'

var chai = require('chai')
var expect = chai.expect

var data = null

describe('[integration] administrator auto test', function () {
  it('should initialize fake data', function (done) {
    expect(global.ABIBAO.uuid).to.be.a('string')
    expect(global.ABIBAO.services.domain.AdministratorModel).to.be.not.undefined
    expect(global.ABIBAO.services.domain.AdministratorModel).to.be.not.null
    var Model = global.ABIBAO.services.domain.AdministratorModel
    data = new Model({}).getFakeData()
    done()
  })
  it('should create', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorCreateCommand', data)
      .then(function (create) {
        data = create
        done()
      })
      .catch(function (error) {
        console.log(error)
        done(error)
      })
  })
  it('should read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'administratorReadQuery', data.urn)
      .then(function (read) {
        data = read
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorUpdateCommand', data)
      .then(function (update) {
        data = update
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorDeleteCommand', data.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should not create', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorCreateCommand', {})
      .catch(function () {
        done()
      })
  })
  it('should not read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'administratorReadQuery', {})
      .catch(function () {
        done()
      })
  })
  it('should not update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorUpdateCommand', {})
      .catch(function () {
        done()
      })
  })
  it('should not delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorDeleteCommand', {})
      .catch(function () {
        done()
      })
  })
})
