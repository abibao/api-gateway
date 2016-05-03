'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var faker = require('faker')
var _ = require('lodash')

var individualFake = {
  email: faker.internet.email(),
  password: faker.name.lastName()
}

var Domain = require('./modules/domain')

describe('individual story', function () {
  it('should initialize domain if not done yet', function (done) {
    if (!global.domain) {
      Domain.initialize()
        .then(function () {
          done()
        })
    } else {
      done()
    }
  })
  it('should register', function (done) {
    global.domain.individualRegisterCommand({
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      individualFake.id = global.domain.getIDfromURN(result.urn)
      done()
    })
  })
  it('should not login', function (done) {
    global.domain.individualLoginWithCredentialsCommand({
      email: individualFake.email,
      password: individualFake.password + '_' + individualFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should login', function (done) {
    global.domain.individualLoginWithCredentialsCommand({
      email: individualFake.email,
      password: individualFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      individualFake.token = result.token
      individualFake.globalInfos = result.globalInfos
      expect(individualFake.globalInfos.abibaoInProgress).to.be.not.undefined
      expect(individualFake.globalInfos.abibaoInProgress).to.be.a('array')
      done()
    })
  })
  it('should load a survey with credentials controls', function (done) {
    expect(individualFake.globalInfos.abibaoInProgress).to.be.not.undefined
    expect(individualFake.globalInfos.abibaoInProgress).to.be.a('array')
    var surveyToLoad = individualFake.globalInfos.abibaoInProgress[0]
    global.domain.surveyReadPopulateControlIndividualQuery({
      credentials: individualFake.token,
      urn: surveyToLoad.urn
    })
      .then(function (result) {
        expect(result).to.be.not.null
        individualFake.surveyToAnswer = result
        expect(individualFake.surveyToAnswer.items).to.be.not.undefined
        expect(individualFake.surveyToAnswer.items).to.be.a('array')
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should answer a survey with individual control error', function (done) {
    expect(individualFake.surveyToAnswer.items).to.be.not.undefined
    expect(individualFake.surveyToAnswer.items).to.be.a('array')
    global.domain.individualSurveyAnswerCommand({
      credentials: faker.name.lastName(),
      survey: individualFake.surveyToAnswer.urn,
      label: individualFake.surveyToAnswer.items[0].label,
      answer: ''
    })
      .catch(function (error) {
        expect(error.message).to.be.not.undefined
        expect(error.message).to.equal('INDIVIDUAL_CONTROL_FAILED')
        done()
      })
  })
  it('should answer a survey with no error', function (done) {
    expect(individualFake.surveyToAnswer.items).to.be.not.undefined
    expect(individualFake.surveyToAnswer.items).to.be.a('array')
    global.domain.individualSurveyAnswerCommand({
      credentials: {
        urn: individualFake.globalInfos.urn
      },
      survey: individualFake.surveyToAnswer.urn,
      label: individualFake.surveyToAnswer.items[0].label,
      answer: faker.name.lastName()
    })
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('shoud delete traces', function (done) {
    global.domain.individualDeleteCommand(global.domain.getURNfromID(individualFake.id))
      .then(function () {
        global.domain.r.table('surveys').filter({})
          .then(function (surveys) {
            _.map(surveys, function (item, key) {
              global.domain.surveyDeleteCommand(global.domain.getURNfromID(item.id, 'survey'))
                .then(function (result) {
                  if (key === surveys.length - 1) { done() }
                })
            })
          })
      })
      .catch(function (error) {
        done(error)
      })
  })
})
