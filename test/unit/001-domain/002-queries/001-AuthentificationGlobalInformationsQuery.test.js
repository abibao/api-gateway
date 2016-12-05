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
        expect(error).to.be.an('object')
        expect(error.error.message).to.be.a('string').to.equal('Action is unauthorized')
        done()
      })
  })
  it('should fail controls on action', function (done) {
    domain.execute('Query', 'AuthentificationGlobalInformationsQuery', {action: 'ABIBAO_CONST_TOKEN_AUTH_ME'})
      .catch((error) => {
        expect(error).to.be.an('object')
        expect(error.error.message).to.be.a('string').to.equal('Scope is unauthorized')
        done()
      })
  })
})
