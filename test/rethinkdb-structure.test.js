'use strict'

var Promise = require('bluebird')
var config = require('../config')
var r = require('../src/connections/thinky').r

var createRethinkdbDatabase = function () {
  return new Promise((resolve, reject) => {
    r.dbList()
      .contains(config('ABIBAO_API_GATEWAY_RETHINKDB_DATABASE'))
      .then((exists) => {
        if (exists === true) {
          resolve()
        } else {
          r.dbCreate(config('ABIBAO_API_GATEWAY_RETHINKDB_DATABASE'))
            .then(() => {
              resolve()
            })
            .catch(reject)
        }
      })
  })
}

describe('rethinkdb structure', function () {
  it('should initialize database ' + config('ABIBAO_API_GATEWAY_RETHINKDB_DATABASE'), function (done) {
    createRethinkdbDatabase().then(done).catch(done)
  })
  it('should delete individuals table', function (done) {
    r.table('individuals').delete().then(() => {
      done()
    }).catch(() => {
      done()
    })
  })
  it('should delete administrators table', function (done) {
    r.table('administrators').delete().then(() => {
      done()
    }).catch(() => {
      done()
    })
  })
  it('should delete surveys table', function (done) {
    r.table('surveys').delete().then(() => {
      done()
    }).catch(() => {
      done()
    })
  })
  it('should delete entities table', function (done) {
    r.table('entities').delete().then(() => {
      done()
    }).catch(() => {
      done()
    })
  })
  it('should delete campaigns table', function (done) {
    r.table('campaigns').delete().then(() => {
      done()
    }).catch(() => {
      done()
    })
  })
  it('should delete campaigns_items table', function (done) {
    r.table('campaigns_items').delete().then(() => {
      done()
    }).catch(() => {
      done()
    })
  })
  it('should delete campaigns_items_choices table', function (done) {
    r.table('campaigns_items_choices').delete().then(() => {
      done()
    }).catch(() => {
      done()
    })
  })
})

describe('rethinkdb data', function () {
  it('should create one administrator', function (done) {
    r.table('administrators')
      .insert({
        'createdAt': r.now(),
        'email': 'admin@abibao.com',
        'hashedPassword': 'X6v+4xv+5KQpnaGzyzuNZWcmDViE0qUiy/xAlmYXGjPh7DUQrmSnqqrGTu6itpXK+8pQfFMuroiuQvSiyD3MKA==',
        'id': '582d787db54c107b8466cac1',
        'modifiedAt': r.now(),
        'salt': 'r3wCbr4dUF4DuO+M1KNlaw==',
        'scope': 'administrator'
      })
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should create "none" entity', function (done) {
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
    var campaignsList = [{
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
    r.table('campaigns_items')
      .insert({
        'addCustomOption': true,
        'alignment': 'horizontal',
        'campaign': '56eb24cfe9b0fbf30250f8c7',
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
    r.table('campaigns_items_choices')
      .insert({
        'campaign': '56eb2757e9b0fbf30250f8cb',
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
