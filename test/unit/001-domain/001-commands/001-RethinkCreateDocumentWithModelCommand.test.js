'use strict'

const chai = require('chai')
const expect = chai.expect

const engine = require('../../../engine.mock')
const Domain = require('../../../../src-v3/lib/Domain')
let domain = false

let entityAbibao = false

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

describe('[unit] domain: RethinkCreateDocumentWithModelCommand', function () {
  it('should create entity abibao', function (done) {
    const params = {
      table: 'entities',
      model: 'EntityModel'
    }
    const payload = {
      name: 'abibao name',
      contact: 'gilles@abibao.com',
      url: 'http://abibao.com',
      type: 'abibao',
      title: 'abibao title',
      hangs: 'abibao hangs',
      description: 'abibao description',
      usages: 'abibao usages'
    }
    domain.execute('Command', 'RethinkCreateDocumentWithModelCommand', {params, payload})
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result.result).to.be.an('object')
        entityAbibao = result.result
        done()
      })
      .catch(done)
  })
  it('should create campaign n°1 for abibao', function (done) {
    const params = {
      table: 'campaigns',
      model: 'CampaignModel'
    }
    const payload = {
      name: 'abibao campaign 1',
      position: 1,
      company: entityAbibao.id
    }
    domain.execute('Command', 'RethinkCreateDocumentWithModelCommand', {params, payload})
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result.result).to.be.an('object')
        done()
      })
      .catch(done)
  })
  it('should create campaign n°2 for abibao', function (done) {
    const params = {
      table: 'campaigns',
      model: 'CampaignModel'
    }
    const payload = {
      name: 'abibao campaign 2',
      position: 2,
      company: entityAbibao.id
    }
    domain.execute('Command', 'RethinkCreateDocumentWithModelCommand', {params, payload})
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result.result).to.be.an('object')
        done()
      })
      .catch(done)
  })
})
