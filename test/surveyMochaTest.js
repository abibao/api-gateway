'use strict'

var chai = require('chai')
var expect = chai.expect

var engine = require('../src/engine')
var data = null

describe('survey auto test', function () {
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
    expect(global.ABIBAO.services.domain.SurveyModel).to.be.not.undefined
    expect(global.ABIBAO.services.domain.SurveyModel).to.be.not.null
    var Model = global.ABIBAO.services.domain.SurveyModel
    data = new Model({}).getFakeData()
    done()
  })
  it('should create', function (done) {
    global.ABIBAO.services.domain.execute('command', 'surveyCreateCommand', data)
      .then(function (create) {
        data = create
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'surveyReadQuery', data.urn)
      .then(function (read) {
        data = read
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'surveyUpdateCommand', data)
      .then(function (update) {
        data = update
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'surveyDeleteCommand', data.urn)
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should not create', function (done) {
    global.ABIBAO.services.domain.execute('command', 'surveyCreateCommand', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not read', function (done) {
    global.ABIBAO.services.domain.execute('query', 'surveyReadQuery', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not update', function (done) {
    global.ABIBAO.services.domain.execute('command', 'surveyUpdateCommand', {})
      .catch(function (error) {
        done()
      })
  })
  it('should not delete', function (done) {
    global.ABIBAO.services.domain.execute('command', 'surveyDeleteCommand', {})
      .catch(function (error) {
        done()
      })
  })
})
