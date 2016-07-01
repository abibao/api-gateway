'use strict'

var chai = require('chai')
var expect = chai.expect
var faker = require('faker')

var engine = require('../src/engine')

var administratorFake = {
  email: faker.internet.email().toLowerCase(),
  password: faker.name.lastName().toLowerCase()
}

describe('administrator story', function () {
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
  it('should not register', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorRegisterCommand', {
      email: administratorFake.email,
      password1: administratorFake.password,
      password2: administratorFake.password + '_' + administratorFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should register', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorRegisterCommand', {
      email: administratorFake.email,
      password1: administratorFake.password,
      password2: administratorFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('urn')
      administratorFake.id = global.ABIBAO.services.domain.getIDfromURN(result.urn)
      done()
    }).catch(function (error) {
      done(error)
    })
  })
  it('should not login', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorLoginWithCredentialsCommand', {
      email: administratorFake.email,
      password: administratorFake.password + '_' + administratorFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should login', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorLoginWithCredentialsCommand', {
      email: administratorFake.email,
      password: administratorFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('token')
      administratorFake.urn = result.urn
      done()
    }).catch(function (error) {
      done(error)
    })
  })
  it('should update administrator', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorUpdateCommand', {
      urn: administratorFake.urn,
      email: administratorFake.email
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('urn')
      expect(result.urn).to.be.equal(administratorFake.urn)
      done()
    }).catch(function (error) {
      done(error)
    })
  })
  it('shoud delete traces', function (done) {
    global.ABIBAO.services.domain.execute('command', 'administratorDeleteCommand', administratorFake.urn)
      .then(function (result) {
        expect(result).to.be.not.null
        expect(result).to.be.an('object')
        expect(result).to.have.property('urn')
        expect(result.urn).to.be.equal(administratorFake.urn)
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
