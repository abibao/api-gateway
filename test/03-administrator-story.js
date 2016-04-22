'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var faker = require('faker')

var Services = require('./../src/services')
var domain

var administratorFake = {
  email: faker.internet.email(),
  password: faker.name.lastName()
}

describe('administrator story', function () {
  it('should not re-initialize domain', function (done) {
    domain = Services.domain()
    Services.startDomain(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should not register', function (done) {
    domain.administratorRegisterCommand({
      email: administratorFake.email,
      password1: administratorFake.password,
      password2: administratorFake.password + '_' + administratorFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should register', function (done) {
    domain.administratorRegisterCommand({
      email: administratorFake.email,
      password1: administratorFake.password,
      password2: administratorFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      administratorFake.id = domain.getIDfromURN(result.urn)
      done()
    })
  })
  it('should not login', function (done) {
    domain.administratorLoginWithCredentialsCommand({
      email: administratorFake.email,
      password: administratorFake.password + '_' + administratorFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should login', function (done) {
    domain.administratorLoginWithCredentialsCommand({
      email: administratorFake.email,
      password: administratorFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      done()
    })
  })
  it('shoud be deleted', function (done) {
    domain.r.table('administrators').get(administratorFake.id).delete()
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
