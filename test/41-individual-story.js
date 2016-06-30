'use strict'

var chai = require('chai')
var expect = chai.expect
var faker = require('faker')

var engine = require('../src/engine')

var individualFake = {
  email: faker.internet.email().toLowerCase(),
  password: faker.name.lastName().toLowerCase()
}

describe('individual story', function () {
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
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password + '_' + individualFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should register', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('urn')
      individualFake.urn = result.urn
      individualFake.id = global.ABIBAO.services.domain.getIDfromURN(result.urn)
      done()
    }).catch(function (error) {
      done(error)
    })
  })
  it('should not login', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualLoginWithCredentialsCommand', {
      email: individualFake.email,
      password: individualFake.password + '_' + individualFake.password
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should login', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualLoginWithCredentialsCommand', {
      email: individualFake.email,
      password: individualFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('token')
      done()
    }).catch(function (error) {
      done(error)
    })
  })
  it('should create a fingerprint', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualCreateFingerprintTokenCommand', {
      email: individualFake.email,
      urn: individualFake.urn
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.a('string')
      individualFake.fingerprint = result
      done()
    }).catch(function (error) {
      done(error)
    })
  })
  it('should not login with fingerprint (error)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualLoginWithFingerprintCommand', 'Winter is coming!')
      .catch(function (error) {
        done()
      })
  })
  it('should login with fingerprint', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualLoginWithFingerprintCommand', individualFake.fingerprint)
      .then(function (result) {
        expect(result).to.be.not.null
        expect(result).to.be.an('object')
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should not get informations (missing action)', function (done) {
    global.ABIBAO.services.domain.execute('query', 'authentificationGlobalInformationsQuery', {
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should not get informations (wrong action)', function (done) {
    global.ABIBAO.services.domain.execute('query', 'authentificationGlobalInformationsQuery', {
      action: 'BAD_ACTION'
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should not get informations (wrong scope)', function (done) {
    global.ABIBAO.services.domain.execute('query', 'authentificationGlobalInformationsQuery', {
      action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME,
      scope: 'BAD_SCOPE'
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should not get informations (wrong urn)', function (done) {
    global.ABIBAO.services.domain.execute('query', 'authentificationGlobalInformationsQuery', {
      action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME,
      scope: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL,
      urn: 'BAD_URN'
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should get informations', function (done) {
    global.ABIBAO.services.domain.execute('query', 'authentificationGlobalInformationsQuery', {
      action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_AUTH_ME,
      scope: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_USER_SCOPE_INDIVIDUAL,
      urn: individualFake.urn
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      done()
    }).catch(function (error) {
      done(error)
    })
  })
  it('should update individual', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualUpdateCommand', {
      urn: individualFake.urn,
      email: individualFake.email
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('urn')
      expect(result.urn).to.be.equal(individualFake.urn)
      done()
    }).catch(function (error) {
      done(error)
    })
  })
  it('shoud delete traces', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualDeleteCommand', individualFake.urn)
      .then(function (result) {
        expect(result).to.be.not.null
        expect(result).to.be.an('object')
        expect(result).to.have.property('urn')
        expect(result.urn).to.be.equal(individualFake.urn)
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
})
