/* eslint-disable */
'use strict'

var chai = require('chai')
var expect = chai.expect
var faker = require('faker')

var individualFake = {
  email: faker.internet.email().toLowerCase(),
  password: faker.name.lastName().toLowerCase()
}

describe('[integration] individual story', function () {
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
      setTimeout(() => {
        done()
      }, 1000)
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
      urn: individualFake.urn,
      email: individualFake.email
    })
      .then(function (result) {
        expect(result).to.be.not.null
        expect(result).to.be.a('string')
        individualFake.fingerprint = result
        done()
      })
      .catch(function (error) {
        done(error)
      })
  })
  it('should not login with fingerprint (error)', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualLoginWithFingerprintCommand', 'Winter is coming!')
      .catch(function () {
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
  it('should success affect a campaign', function (done) {
    global.ABIBAO.services.domain.execute('command', 'individualCreateSurveyCommand', {
      individual: individualFake.urn,
      campaign: global.ABIBAO.services.domain.getURNfromID('56eb24cfe9b0fbf30250f8c7', 'campaign'),
      charity: global.ABIBAO.services.domain.getURNfromID('ffaa131ca533a2a04be325aa', 'entity')
    }).then(function () {
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
  it('shoud wait 3000ms (bus events)', function (done) {
    setTimeout(() => {
      done()
    }, 3000)
  })
})
