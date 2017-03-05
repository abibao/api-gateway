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

describe('[unit] domain: AuthentificationGlobalInformationsQuery', function () {
  it('should fail controls on action', function (done) {
    domain.execute('Query', 'AuthentificationGlobalInformationsQuery', {})
      .catch((error) => {
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('gateway-domain')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('service_error')
        expect(error['gateway-domain']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        expect(error.details).to.have.property('type')
        expect(error.details).to.have.property('name')
        expect(error.details.type).to.eq('Query.Error')
        expect(error.details.name).to.eq('AuthentificationGlobalInformationsQuery')
        expect(error.details.error.toString()).to.eq('Error: Action is unauthorized')
        done()
      })
  })
  it('should fail controls on action', function (done) {
    domain.execute('Query', 'AuthentificationGlobalInformationsQuery', {action: 'ABIBAO_CONST_TOKEN_AUTH_ME'})
      .catch((error) => {
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('gateway-domain')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('service_error')
        expect(error['gateway-domain']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        expect(error.details).to.have.property('type')
        expect(error.details).to.have.property('name')
        expect(error.details.type).to.eq('Query.Error')
        expect(error.details.name).to.eq('AuthentificationGlobalInformationsQuery')
        expect(error.details.error.toString()).to.eq('Error: Scope is unauthorized')
        done()
      })
  })
})
