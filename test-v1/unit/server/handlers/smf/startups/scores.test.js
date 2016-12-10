'use strict'

var Promise = require('bluebird')

var chai = require('chai')
var expect = chai.expect

before(function (done) {
  Promise.all([
    require('../../../../../mock-abibao').server(),
    require('../../../../../mock-abibao').domain()
  ]).then(() => {
    done()
  })
})

describe('[unit] server: /v1/wp_json/smf/startups/scores', function () {
  it('should get all totals for smf', function (done) {
    var req = {
      method: 'GET',
      url: '/v1/wp_json/smf/startups/scores'
    }
    global.ABIBAO.services.server.inject(req, res => {
      expect(res).to.be.an('object')
      expect(res.result).to.be.an('object')
      expect(res.statusCode).to.be.a('number').to.equal(200)
      done()
    })
  })
})
