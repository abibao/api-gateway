'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var faker = require('faker')

var Services = require('./../src/services')
var domain

var individualFake = {
  email: faker.internet.email(),
  password: faker.name.lastName()
}

describe('individual story', function () {
  it('should not re-initialize domain', function (done) {
    domain = Services.domain()
    Services.startDomain(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should not register', function (done) {
    domain.individualRegisterCommand({
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password + '_' + individualFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should register', function (done) {
    domain.individualRegisterCommand({
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      individualFake.id = domain.getIDfromURN(result.urn)
      done()
    })
  })
  it('should not login', function (done) {
    domain.individualLoginWithCredentialsCommand({
      email: individualFake.email,
      password: individualFake.password + '_' + individualFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should login', function (done) {
    domain.individualLoginWithCredentialsCommand({
      email: individualFake.email,
      password: individualFake.password
    }).then(function (result) {
      individualFake.token = result.token
      individualFake.globalInfos = result.globalInfos
      expect(result).to.be.not.null
      done()
    })
  })
  it('shoud be deleted', function (done) {
    domain.r.table('individuals').get(individualFake.id).delete()
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
