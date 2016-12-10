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

describe('[unit] domain: SurveyReadPopulateControlIndividualQuery', function () {
  it('should fail decrypt the urn', function (done) {
    domain.execute('Query', 'SurveyReadPopulateControlIndividualQuery', {
      urn: 'this:is:not:a:valid:urn'
    })
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
        expect(error.details.name).to.eq('SurveyReadPopulateControlIndividualQuery')
        expect(error.details.error.toString()).to.eq('TypeError: Bad input string')
        done()
      })
  })
  it('should prepare a survey for individual_test', function (done) {
    const params = {
      table: 'surveys',
      model: 'SurveyModel'
    }
    const payload = {
      campaign: 'campaign_test',
      company: 'company_test',
      charity: 'charity_test',
      individual: 'individual_test',
      answers: {},
      abibao: true,
      complete: false
    }
    domain.execute('Command', 'RethinkCreateDocumentWithModelCommand', {params, payload})
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result.result).to.be.an('object')
        done()
      })
      .catch((error) => {
        console.log(error)
      })
  })
})
