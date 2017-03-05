/* eslint-disable */
'use strict'

// urnSurvey = urn:abibao:database:survey:ffd7d984c642f3cd0993ee73c9bbbfd2a2c4cbd59a364e38

var chai = require('chai')
var expect = chai.expect
var faker = require('faker')

var individualFake = {}

describe('[integration] individual register story', function () {
  it('should not register with email and (bad) entity', function (done) {
    individualFake = {
      email: faker.internet.email().toLowerCase(),
      password: faker.name.lastName().toLowerCase()
    }
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password,
      entity: 'urn:abibao:database:entity:BAD'
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should not register with email and (bad) survey', function (done) {
    individualFake = {
      email: faker.internet.email().toLowerCase(),
      password: faker.name.lastName().toLowerCase()
    }
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password,
      survey: 'urn:abibao:database:entity:BAD'
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should not register with email and (bad) source', function (done) {
    individualFake = {
      email: faker.internet.email().toLowerCase(),
      password: faker.name.lastName().toLowerCase()
    }
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password,
      source: 123456789
    }).catch(function (error) {
      expect(error).to.be.not.null
      done()
    })
  })
  it('should register with email', function (done) {
    individualFake = {
      email: faker.internet.email().toLowerCase(),
      password: faker.name.lastName().toLowerCase()
    }
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('urn')
      expect(result.urnRegisteredEntity).to.be.eq(global.ABIBAO.services.domain.getURNfromID('none', 'entity'))
      expect(result.urnRegisteredSurvey).to.be.eq(global.ABIBAO.services.domain.getURNfromID('none', 'campaign'))
      expect(result.hasRegisteredSource).to.be.eq('none')
      individualFake.urn = result.urn
      individualFake.id = global.ABIBAO.services.domain.getIDfromURN(result.urn)
      setTimeout(() => {
        done()
      }, 1000)
    }).catch(function (error) {
      done(error)
    })
  })
  it('should register with email and entity', function (done) {
    individualFake = {
      email: faker.internet.email().toLowerCase(),
      password: faker.name.lastName().toLowerCase()
    }
    var urnEntity = global.ABIBAO.services.domain.getURNfromID('ffaa131ca533a2a04be325aa', 'entity')
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password,
      entity: urnEntity
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('urn')
      expect(result.urnRegisteredEntity).to.be.not.eq('none')
      expect(result.urnRegisteredSurvey).to.be.eq(global.ABIBAO.services.domain.getURNfromID('none', 'campaign'))
      expect(result.hasRegisteredSource).to.be.eq('none')
      individualFake.urn = result.urn
      individualFake.id = global.ABIBAO.services.domain.getIDfromURN(result.urn)
      setTimeout(() => {
        done()
      }, 1000)
    }).catch(function (error) {
      done(error)
    })
  })
  it('should register with email, entity and survey', function (done) {
    individualFake = {
      email: faker.internet.email().toLowerCase(),
      password: faker.name.lastName().toLowerCase()
    }
    var urnEntity = global.ABIBAO.services.domain.getURNfromID('ffaa131ca533a2a04be325aa', 'entity')
    var urnSurvey = global.ABIBAO.services.domain.getURNfromID('56eb2501e9b0fbf30250f8c8', 'survey')
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password,
      entity: urnEntity,
      survey: urnSurvey
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('urn')
      expect(result.urnRegisteredEntity).to.be.not.eq('none')
      expect(result.urnRegisteredSurvey).to.be.not.eq('none')
      expect(result.hasRegisteredSource).to.be.eq('none')
      individualFake.urn = result.urn
      individualFake.id = global.ABIBAO.services.domain.getIDfromURN(result.urn)
      setTimeout(() => {
        done()
      }, 1000)
    }).catch(function (error) {
      done(error)
    })
  })
  it('should register with email, entity, survey and source', function (done) {
    individualFake = {
      email: faker.internet.email().toLowerCase(),
      password: faker.name.lastName().toLowerCase()
    }
    var urnEntity = global.ABIBAO.services.domain.getURNfromID('ffaa131ca533a2a04be325aa', 'entity')
    var urnSurvey = global.ABIBAO.services.domain.getURNfromID('56eb2501e9b0fbf30250f8c8', 'survey')
    global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', {
      email: individualFake.email,
      password1: individualFake.password,
      password2: individualFake.password,
      entity: urnEntity,
      survey: urnSurvey,
      source: 'this is a source'
    }).then(function (result) {
      expect(result).to.be.not.null
      expect(result).to.be.an('object')
      expect(result).to.have.property('urn')
      expect(result.urnRegisteredEntity).to.be.not.eq('none')
      expect(result.urnRegisteredSurvey).to.be.not.eq('none')
      expect(result.hasRegisteredSource).to.be.not.eq('none')
      individualFake.urn = result.urn
      individualFake.id = global.ABIBAO.services.domain.getIDfromURN(result.urn)
      setTimeout(() => {
        done()
      }, 1000)
    }).catch(function (error) {
      done(error)
    })
  })
})
