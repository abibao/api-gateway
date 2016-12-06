'use strict'

const chai = require('chai')
const expect = chai.expect

const engine = require('../../../engine.mock')
const Domain = require('../../../../src-v3/lib/Domain')
let domain = false

before(function (done) {
  engine.initialize()
    .then(() => {
      domain = new Domain(engine)
      return domain.initialize().then(() => {
        done()
      })
    })
    .catch(done)
})

describe('[unit] domain: IndividualLoginWithCredentialsCommand', function () {
  it('should not validate with joi', function (done) {
    domain.execute('Command', 'IndividualLoginWithCredentialsCommand', {})
      .catch((error) => {
        expect(error).to.be.an('object')
        expect(error.error.message).to.be.a('string').to.equal('child "email" fails because ["email" is required]')
        done()
      })
  })
  it('should not find individual with email test@abibao.com', function (done) {
    domain.execute('Command', 'IndividualLoginWithCredentialsCommand', {email: 'test@abibao.com', password: 'password'})
      .catch((error) => {
        expect(error).to.be.an('object')
        expect(error.error).to.be.an('error')
        done()
      })
  })
  it('should failed login because password is wrong', function (done) {
    domain.execute('Command', 'IndividualLoginWithCredentialsCommand', {email: 'gperreymond@gmail.com', password: 'password'})
      .catch((error) => {
        expect(error).to.be.an('object')
        expect(error.error).to.be.an('error')
        expect(error.error.message).to.be.eq('ERROR_BAD_AUTHENTIFICATION')
        done()
      })
  })
  it('should success login and return globalInfos', function (done) {
    domain.execute('Command', 'IndividualLoginWithCredentialsCommand', {email: 'gperreymond@gmail.com', password: 'test1234'})
      .then((result) => {
        expect(result.result).to.be.an('object')
        expect(result.result.token).to.be.a('string')
        expect(result.result.globalInfos).to.be.an('object')
        expect(result.result.globalInfos.urn).to.be.a('string')
        expect(result.result.globalInfos.abibaoInProgress).to.be.an('array')
        expect(result.result.globalInfos.abibaoCompleted).to.be.an('array')
        expect(result.result.globalInfos.surveysInProgress).to.be.an('array')
        expect(result.result.globalInfos.surveysCompleted).to.be.an('array')
        expect(result.result.globalInfos.abibaoInProgress.length).to.be.eq(2)
        done()
      })
      .catch(done)
  })
})
