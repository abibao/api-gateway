'use strict'

var Promise = require('bluebird')

var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var createRethinkdbDatabase = function (database) {
  return new Promise((resolve, reject) => {
    var r = require('../src/connections/rethinkdbdash')('EMPTY')
    r.dbList()
      .contains(database)
      .run()
      .then((exists) => {
        if (exists === true) {
          resolve()
        } else {
          r.dbCreate(database)
            .then(() => {
              resolve()
            })
            .catch(reject)
        }
      })
  })
}

var createRethinkdbTable = function (database, name) {
  return new Promise((resolve, reject) => {
    var r = require('../src/connections/rethinkdbdash')('EMPTY')
    r.db(database)
      .tableList()
      .contains(name)
      .run()
      .then((exists) => {
        if (exists === true) {
          r.db(database).table(name)
            .delete()
            .run()
            .then(() => {
              resolve()
            }).catch(reject)
        } else {
          r.db(database).tableCreate(name)
            .run()
            .then(() => {
              resolve()
            }).catch(reject)
        }
      })
      .catch(reject)
  })
}

describe('rethinkdb structure', function () {
  it('should create database mvp', function (done) {
    createRethinkdbDatabase(nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB')).then(done).catch(done)
  })
  it('should create table mvp.surveys', function (done) {
    createRethinkdbTable(nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'), 'surveys').then(done).catch(done)
  })
  it('should create table mvp.administrators', function (done) {
    createRethinkdbTable(nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'), 'administrators').then(done).catch(done)
  })
  it('should create table mvp.individuals', function (done) {
    createRethinkdbTable(nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'), 'individuals').then(done).catch(done)
  })
  it('should create table mvp.entities', function (done) {
    createRethinkdbTable(nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'), 'entities').then(done).catch(done)
  })
  it('should create table mvp.campaigns', function (done) {
    createRethinkdbTable(nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'), 'campaigns').then(done).catch(done)
  })
  it('should create table mvp.campaigns_items', function (done) {
    createRethinkdbTable(nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'), 'campaigns_items').then(done).catch(done)
  })
  it('should create table mvp.campaigns_items_choices', function (done) {
    createRethinkdbTable(nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_DB'), 'campaigns_items_choices').then(done).catch(done)
  })
  it('should create database sendgrid', function (done) {
    createRethinkdbDatabase('sendgrid').then(done).catch(done)
  })
  it('should create table sendgrid.bounces', function (done) {
    createRethinkdbTable('sendgrid', 'bounces').then(done).catch(done)
  })
})
describe('rethinkdb data', function () {
  it('should create "none" entity', function (done) {
    var r = require('../src/connections/rethinkdbdash')()
    r.table('entities')
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
  it('should create "abibao" entity', function (done) {
    var r = require('../src/connections/rethinkdbdash')()
    r.table('entities')
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
  it('should create "association" entity', function (done) {
    var r = require('../src/connections/rethinkdbdash')()
    r.table('entities')
      .insert({
        'avatar': 'images/avatars/default.png',
        'contact': 'association@abibao.com',
        'createdAt': r.now(),
        'description': 'Association Description',
        'hangs': 'Association Accroche',
        'icon': 'images/icons/default.png',
        'id': 'ffaa131ca533a2a04be325aa',
        'modifiedAt': r.now(),
        'name': 'Association Nom',
        'picture': 'images/pictures/default.png',
        'title': 'Association Title',
        'type': 'charity',
        'url': 'http://www.association.com',
        'usages': ''
      })
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should create four campaigns for abibao', function (done) {
    var r = require('../src/connections/rethinkdbdash')()
    var campaignsList = [{
      'company': '56aa131ca533a2a04be325ae',
      'createdAt': r.now(),
      'description': 'Premiere série de questions diverses pour l\'onboarding.',
      'id': '56eb2501e9b0fbf30250f8c8',
      'modifiedAt': r.now(),
      'name': 'Sondage profilage 02',
      'position': 2,
      'published': true,
      'screenThankYouContent': '',
      'screenWelcomeContent': ''
    }, {
      'company': '56aa131ca533a2a04be325ae',
      'createdAt': r.now(),
      'description': 'Sondage fondamental',
      'id': '56eb24cfe9b0fbf30250f8c7',
      'modifiedAt': r.now(),
      'name': 'Sondage profilage 01',
      'position': 1,
      'published': true,
      'screenThankYouContent': '',
      'screenWelcomeContent': ''
    }, {
      'company': '56aa131ca533a2a04be325ae',
      'createdAt': r.now(),
      'id': '57232b4e1cfabe0c00aee4f7',
      'modifiedAt': '2016-05-02T10:01:56.030Z',
      'name': 'Sondage profilage 03',
      'position': 3,
      'published': true,
      'screenThankYouContent': '',
      'screenWelcomeContent': ''
    }, {
      'company': '56aa131ca533a2a04be325ae',
      'createdAt': r.now(),
      'id': '57234dd91cfabe0c00aee4f8',
      'modifiedAt': r.now(),
      'name': 'Sondage profilage 04',
      'position': 4,
      'published': true,
      'screenThankYouContent': '',
      'screenWelcomeContent': ''
    }]
    r.table('campaigns')
      .insert(campaignsList)
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should create one campaign_item', function (done) {
    var r = require('../src/connections/rethinkdbdash')()
    r.table('campaigns_items')
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
    var r = require('../src/connections/rethinkdbdash')()
    r.table('campaigns_items_choices')
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
})
