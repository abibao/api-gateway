'use strict'

var chai = require('chai')
var expect = chai.expect

var engine = require('../src/engine')
var r = require('../src/lib/rethinkdb').r

describe('rethinkdb structure', function () {
  it('should create database if not exists', function (done) {
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.dbCreate(db)
      .then(() => {
        done()
      })
      .catch(() => {
        done()
      })
  })
  it('should create table entities', function (done) {
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.db('mvp_deve').tableList().contains('entities')
      .then((exists) => {
        if (exists === true) {
          r.db(db).table('entities').delete()
            .then(() => {
              done()
            }).catch(done)
        } else {
          r.db(db).tableCreate('entities')
            .then(() => {
              done()
            }).catch(done)
        }
      })
      .catch(done)
  })
  it('should create table campaigns', function (done) {
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.db('mvp_deve').tableList().contains('campaigns')
      .then((exists) => {
        if (exists === true) {
          r.db(db).table('campaigns').delete()
            .then(() => {
              done()
            }).catch(done)
        } else {
          r.db(db).tableCreate('campaigns')
            .then(() => {
              done()
            }).catch(done)
        }
      })
      .catch(done)
  })
  it('should create table campaigns_items', function (done) {
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.db('mvp_deve').tableList().contains('campaigns_items')
      .then((exists) => {
        if (exists === true) {
          r.db(db).table('campaigns_items').delete()
            .then(() => {
              done()
            }).catch(done)
        } else {
          r.db(db).tableCreate('campaigns_items')
            .then(() => {
              done()
            }).catch(done)
        }
      })
      .catch(done)
  })
  it('should create table campaigns_items_choices', function (done) {
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.db('mvp_deve').tableList().contains('campaigns_items_choices')
      .then((exists) => {
        if (exists === true) {
          r.db(db).table('campaigns_items_choices').delete()
            .then(() => {
              done()
            }).catch(done)
        } else {
          r.db(db).tableCreate('campaigns_items_choices')
            .then(() => {
              done()
            }).catch(done)
        }
      })
      .catch(done)
  })

  it('should create entity none', function (done) {
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.db(db).table('entities')
      .insert({
        'avatar': 'images/avatars/default.png',
        'contact': 'none@abibao.com',
        'createdAt': r.now(),
        'description': '',
        'hangs': '',
        'icon': 'images/icons/default.png',
        'id': 'none',
        'modifiedAt': r.now(),
        'name': 'none',
        'picture': 'images/pictures/default.png',
        'title': '',
        'type': 'none',
        'url': 'http://',
        'usages': ''
      })
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should create abibao entity', function (done) {
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.db(db).table('entities')
      .insert({
        'avatar': 'images/avatars/default.png',
        'contact': 'team@abibao.com',
        'createdAt': r.now(),
        'description': 'Abibao Description',
        'hangs': 'Abibao Accroche',
        'icon': 'images/icons/default.png',
        'id': '56aa131ca533a2a04be325ae',
        'modifiedAt': r.now(),
        'name': 'Abibao Nom',
        'picture': 'images/pictures/default.png',
        'title': 'Abibao Title',
        'type': 'abibao',
        'url': 'http://www.abibao.com',
        'usages': ''
      })
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should create four campaigns for abibao', function (done) {
    var campaignsList = [{
      'company': '56aa131ca533a2a04be325ae',
      'createdAt': r.now(),
      'currency': 'EUR',
      'description': 'Premiere série de questions diverses pour l\'onboarding.',
      'id': '56eb2501e9b0fbf30250f8c8',
      'modifiedAt': r.now(),
      'name': 'Sondage profilage 02',
      'position': 2,
      'price': 0,
      'published': true,
      'screenThankYouContent': '',
      'screenWelcomeContent': ''
    }, {
      'company': '56aa131ca533a2a04be325ae',
      'createdAt': r.now(),
      'currency': 'EUR',
      'description': 'Sondage fondamental',
      'id': '56eb24cfe9b0fbf30250f8c7',
      'modifiedAt': r.now(),
      'name': 'Sondage profilage 01',
      'position': 1,
      'price': 0,
      'published': true,
      'screenThankYouContent': '',
      'screenWelcomeContent': ''
    }, {
      'company': '56aa131ca533a2a04be325ae',
      'createdAt': r.now(),
      'currency': 'EUR',
      'id': '57232b4e1cfabe0c00aee4f7',
      'modifiedAt': '2016-05-02T10:01:56.030Z',
      'name': 'Sondage profilage 03',
      'position': 3,
      'price': 0,
      'published': true,
      'screenThankYouContent': '',
      'screenWelcomeContent': ''
    }, {
      'company': '56aa131ca533a2a04be325ae',
      'createdAt': r.now(),
      'currency': 'EUR',
      'id': '57234dd91cfabe0c00aee4f8',
      'modifiedAt': r.now(),
      'name': 'Sondage profilage 04',
      'position': 4,
      'price': 0,
      'published': true,
      'screenThankYouContent': '',
      'screenWelcomeContent': ''
    }]
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.db(db).table('campaigns')
      .insert(campaignsList)
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should create one campaign_item', function (done) {
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.db(db).table('campaigns_items')
      .insert({
        'addCustomOption': true,
        'alignment': 'horizontal',
        'campaign': '56eb2501e9b0fbf30250f8c8',
        'createdAt': r.now(),
        'description': 'Abibao ne s\'intéresse pas à votre identité personnelle. Définissons plutôt vos centres d\'intérêts en tant que consommateur.',
        'id': '56eb2757e9b0fbf30250f8cb',
        'image': '',
        'label': 'ABIBAO_ANSWER_FONDAMENTAL_GENDER',
        'modifiedAt': r.now(),
        'multipleSelections': false,
        'position': 1,
        'question': 'Dites-nous à quoi vous ressemblez ?',
        'randomize': true,
        'required': true,
        'tags': 'genre, sexe, masculin, feminin, gente',
        'type': 'ABIBAO_COMPONENT_MULTIPLE_CHOICE'
      })
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should create one campaign_item_choice', function (done) {
    const db = global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')
    r.db(db).table('campaigns_items_choices')
      .insert({
        'campaign': '56eb2501e9b0fbf30250f8c8',
        'createdAt': r.now(),
        'id': '56ee9a414726e973079d96d0',
        'item': '56eb2757e9b0fbf30250f8cb',
        'modifiedAt': r.now(),
        'position': 1,
        'prefix': 'GENDER',
        'suffix': 'MALE',
        'text': 'Un homme'
      })
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should initialize global.ABIBAO', function (done) {
    if (global.ABIBAO.running === true) {
      done()
    } else {
      engine()
        .then(function () {
          expect(global.ABIBAO.uuid).to.be.a('string')
          done()
        })
        .catch(done)
    }
  })
  it('should verify that engine is running', function (done) {
    expect(global.ABIBAO.running).to.be.eq(true)
    done()
  })
})
