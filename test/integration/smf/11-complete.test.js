/* global describe:false, it:false */
'use strict'

var chai = require('chai')
var expect = chai.expect
var faker = require('faker')

var individualFake = {
  email: faker.internet.email().toLowerCase(),
  password: faker.name.lastName().toLowerCase()
}
describe('[ingegration] SMF complete sequence', function () {
  it('should vote success startup 28 and this email', function (done) {
    global.ABIBAO.services.domain.execute('command', 'wpSMFMakeTheVoteCommand', {
      email: individualFake.email,
      node: 28,
      startup: 28
    }).then(function(result) {
      expect(result).to.be.an('object')
      expect(result).to.have.property('points')
      expect(result).to.have.property('converted')
      expect(result.points).to.eq(1)
      expect(result.converted).to.eq(0)
      done()
    }).catch(done)
  })
  it('should register a user with this email and without charity', function (done) {
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
    }).catch(done)
  })
  it('should update smf vote for this email', function (done) {
    global.ABIBAO.services.domain.execute('command', 'wpSMFUpdateTheVoteCommand', {
      email: individualFake.email
    }).then(function(result) {
      expect(result).to.be.an('object')
      expect(result).to.have.property('points')
      expect(result).to.have.property('converted')
      expect(result.points).to.eq(3)
      expect(result.converted).to.eq(1)
      done()
    }).catch(done)
  })
})
