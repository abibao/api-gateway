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

var endpoints = require('./../src/server/routes').endpoints
var dictionnary = {
  GET: { },
  PATCH: { },
  POST: { },
  DELETE: { }
}
_.map(endpoints, function (endpoint) {
  dictionnary[endpoint.method][endpoint.path] = endpoint
})

var request = {
  auth: {
    credentials: {
      action: 'auth_me',
      scope: 'individual'
    }
  },
  params: { },
  payload: { },
  server: {
    domain: { },
    logger: {
      error: function (error) {
        return error
      }
    }
  }
}

describe('hapijs individual story', function () {
  it('should initialize domain if not done yet', function (done) {
    if (!global.domain) {
      Domain.initialize()
        .then(function () {
          request.server.domain = global.domain
          done()
        })
    } else {
      request.server.domain = global.domain
      done()
    }
  })
  it('should register', function (done) {
    var handler = dictionnary.POST['/v1/individuals/register'].config.handler
    request.payload = {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password
    }
    handler(request, function (response) {
      expect(response.isBoom).be.undefined
      individualFake.id = global.domain.getIDfromURN(response.urn)
      request.auth.credentials.urn = response.urn
      done()
    })
  })
  it('should login', function (done) {
    var handler = dictionnary.POST['/v1/individuals/login'].config.handler
    request.payload = {
      email: individualFake.email,
      password: individualFake.password
    }
    handler(request, function (response) {
      expect(response.isBoom).be.undefined
      expect(response.token).to.be.not.undefined
      individualFake.token = response.token
      done()
    })
  })
  it('should get global informations', function (done) {
    var handler = dictionnary.GET['/v1/auth/global/informations'].config.handler
    handler(request, function (response) {
      expect(response.isBoom).be.undefined
      expect(response.abibaoInProgress).to.be.not.undefined
      individualFake.globalInfos = response
      done()
    })
  })
  it('should load a survey with credentials controls', function (done) {
    var surveyToLoad = individualFake.globalInfos.abibaoInProgress[0]
    var handler = dictionnary.GET['/v1/auth/surveys/{urn}'].config.handler
    request.params.urn = surveyToLoad.urn
    handler(request, function (response) {
      expect(response.isBoom).be.undefined
      expect(response.items).to.be.not.undefined
      expect(response.items).to.be.a('array')
      individualFake.surveyToAnswer = response
      done()
    })
  })
  it('should answer a survey', function (done) {
    var handler = dictionnary.POST['/v1/auth/surveys/{urn}/answers'].config.handler
    request.params.urn = individualFake.surveyToAnswer.urn
    request.payload = {
      label: individualFake.surveyToAnswer.items[0].label,
      answer: faker.name.lastName()
    }
    handler(request, function (response) {
      expect(response.isBoom).be.undefined
      done()
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
