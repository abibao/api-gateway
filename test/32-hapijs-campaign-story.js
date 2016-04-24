'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var faker = require('faker')
var _ = require('lodash')

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

var selectedCampaign = { }
var createdCampaign = { }
var updatedCampaign = { }

describe('hapijs campaign story', function () {
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
  it('should list all campaigns', function (done) {
    var handler = dictionnary.GET['/v1/campaigns'].config.handler
    handler(request, function (response) {
      expect(response.isBoom).be.undefined
      selectedCampaign = response[0]
      done()
    })
  })
  it('should read a campaign', function (done) {
    var handler = dictionnary.GET['/v1/campaigns/{urn}'].config.handler
    request.params.urn = selectedCampaign.urn
    handler(request, function (response) {
      expect(response.isBoom).be.undefined
      done()
    })
  })
  it('should create a campaign', function (done) {
    var handler = dictionnary.POST['/v1/campaigns'].config.handler
    request.payload = _.clone(selectedCampaign)
    delete request.payload.urn
    handler(request, function (response) {
      expect(response.isBoom).be.undefined
      createdCampaign = response
      done()
    })
  })
  it('should update a campaign', function (done) {
    var handler = dictionnary.PATCH['/v1/campaigns/{urn}'].config.handler
    request.params.urn = createdCampaign.urn
    request.payload = createdCampaign
    request.payload.description = faker.lorem.paragraph()
    delete request.payload.urn
    handler(request, function (response) {
      expect(response.isBoom).be.undefined
      updatedCampaign = response
      done()
    })
  })
  it('should delete a campaign', function (done) {
    done()
  })
})
