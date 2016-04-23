'use strict'

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-env.json' })

var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var faker = require('faker')

var administratorFake = {
  email: faker.internet.email(),
  password: faker.name.lastName()
}

var Domain = require('./modules/domain')

describe('administrator story', function () {
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
  it('should not register', function (done) {
    global.domain.administratorRegisterCommand({
      email: administratorFake.email,
      password1: administratorFake.password,
      password2: administratorFake.password + '_' + administratorFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should register', function (done) {
    global.domain.administratorRegisterCommand({
      email: administratorFake.email,
      password1: administratorFake.password,
      password2: administratorFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      administratorFake.id = global.domain.getIDfromURN(result.urn)
      done()
    })
  })
  it('should not login', function (done) {
    global.domain.administratorLoginWithCredentialsCommand({
      email: administratorFake.email,
      password: administratorFake.password + '_' + administratorFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should login', function (done) {
    global.domain.administratorLoginWithCredentialsCommand({
      email: administratorFake.email,
      password: administratorFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      done()
    })
  })
  it('shoud delete traces', function (done) {
    global.domain.r.table('administrators').get(administratorFake.id).delete()
      .then(function () {
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
