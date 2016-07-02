'use strict'

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var databaseRethink = 'recemvp'

var Promise = require('bluebird')
var async = require('async')
var _ = require('lodash')
var engine = require('../src/engine')

var optionsRethink = {
  host: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST'),
  port: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT'),
  db: databaseRethink,
  authKey: nconf.get('ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  silent: true
}
var thinky = require('thinky')(optionsRethink)

var optionsMySQL = {
  client: 'mysql',
  pool: {
    max: 10000
  },
  connection: {
    host: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_HOST'),
    port: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PORT'),
    user: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_USER'),
    password: nconf.get('ABIBAO_API_GATEWAY_SERVER_MYSQL_PASSWORD'),
    database: 'analytics_deve'
  },
  debug: false
}
var knex = require('knex')(optionsMySQL)

var usersNew = []
var usersOld = []
var errorsCSPS = []

var stepUser = function (tUser) {
  return new Promise(function (resolve) {
    console.log('... STEP USER ...')
    var payload
    thinky.r.db(databaseRethink).table('individuals').filter({email: tUser['user_email']})
      .then(function (users) {
        var user = {}
        if (users.length === 0) {
          console.log('... %s will be created', tUser['user_email'])
          payload = {
            email: tUser['user_email'].toLowerCase(),
            password1: tUser['user_password'],
            password2: tUser['user_password'],
            hasRegisteredEntity: 'none:old'
          }
          global.ABIBAO.services.domain.execute('command', 'individualRegisterCommand', payload)
            .then(function (result) {
              user = result
              payload = {
                email: user.email.toLowerCase(),
                password: tUser['user_password']
              }
              return global.ABIBAO.services.domain.execute('command', 'individualLoginWithCredentialsCommand', payload)
            })
            .then(function () {
              resolve(user)
            })
            .catch(function (error) {
              console.log(error)
              console.log('... [ERROR 0] %o', payload)
              resolve()
            })
        } else {
          console.log('... %s exists', tUser['user_email'])
          payload = {
            email: tUser['user_email'].toLowerCase()
          }
          global.ABIBAO.services.domain.execute('query', 'individualFilterQuery', payload)
            .then(function (users) {
              user = users[0]
              resolve(user)
            })
            .catch(function (error) {
              console.log(error)
              resolve()
            })
        }
      })
      .catch(function (error) {
        console.log(error)
        resolve()
      })
  })
}

var stepData = function (tUser) {
  return new Promise(function (resolve, reject) {
    console.log('... STEP DATA ...')
    var data = {
      answers: {},
      campaign: '56eb24cfe9b0fbf30250f8c7',
      charity: '56aa131ca533a2a04be325ae',
      company: '56aa131ca533a2a04be325ae',
      individual: tUser.individual,
      complete: true
    }
    var tDatas
    var tData
    knex('t_datas')
      .where({'user_id': tUser['user_id']})
      .then(function (result) {
        tDatas = result
        if (tDatas.length === 0) {
          resolve()
        } else {
          tData = tDatas[0]
          data.answers.ABIBAO_ANSWER_FONDAMENTAL_AGE = 2015 - tData['datas_age']
          return global.ABIBAO.services.domain.execute('query', 'campaignItemChoiceFilterQuery', {
            prefix: 'GENDER',
            suffix: (tData['datas_genre'] === 'h') ? 'MALE' : 'FEMALE'
          })
        }
      })
      .then(function (genders) {
        if (genders.length === 0) {
          resolve()
        } else {
          var gender = genders[0]
          data.answers.ABIBAO_ANSWER_FONDAMENTAL_GENDER = global.ABIBAO.services.domain.getIDfromURN(gender.urn)
          return thinky.r.db(databaseRethink).table('campaigns_items_choices').filter({prefix: 'ABIBAO_CONST_DPT'})
        }
      })
      .then(function (departments) {
        var department = _.filter(departments, {'suffix': tData['datas_dpts'].toString()})[0]
        if (department) {
          data.answers.ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT = department.id
        }
        return thinky.r.db(databaseRethink).table('campaigns_items_choices').filter({prefix: 'ABIBAO_CONST_CSP'})
      })
      .then(function (csps) {
        if (tData['datas_csp'] === 231) {
          tData['datas_csp'] = '23b'
        }
        var csp = _.filter(csps, {'suffix': tData['datas_csp'].toString()})[0]
        if (csp) {
          data.answers.ABIBAO_ANSWER_FONDAMENTAL_CSP = csp.id
        } else {
          console.log('... error csp n°%s', tData['datas_csp'])
          errorsCSPS.push(tData['datas_csp'])
        }
        // end of data
        if (Object.keys(data.answers).length !== 4) {
          data.complete = false
        }
        return thinky.r.db(databaseRethink).table('surveys').filter({
          campaign: '56eb24cfe9b0fbf30250f8c7',
          charity: '56aa131ca533a2a04be325ae',
          company: '56aa131ca533a2a04be325ae',
          individual: tUser.individual
        }).delete()
      })
      .then(function () {
        return thinky.r.db(databaseRethink).table('surveys').insert(data)
      })
      .then(function () {
        resolve()
      })
      .catch(function () {
        resolve()
      })
  })
}

var stepEmail = function (tUser) {
  return new Promise(function (resolve, reject) {
    if (tUser['user_email'] !== 'vincent@abibao.com') {
      return resolve()
    }
    console.log('... STEP EMAIL ...')
    // send email
    var sendgrid = require('sendgrid').SendGrid(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))
    var request = sendgrid.emptyRequest()
    request.method = 'POST'
    request.path = '/v3/mail/send'
    request.body = {
      'personalizations': [
        {
          'to': [
            {'email': 'gperreymond@gmail.com'}
          ],
          'subject': 'Les sondages qui financent des associations - Choisissez votre association !',
          'substitutions': {
            '%fingerprint%': global.ABIBAO.nconf.get('ABIBAO_WEB_DASHBOARD_URI') + '/login?fingerprint=' + tUser.fingerprint,
            '%individual_login%': tUser['user_email'],
            '%individual_password%': tUser['user_password']
          }
        }
      ],
      'from': { 'email': 'bonjour@abibao.com', 'name': 'Abibao' },
      'content': [
        {
          'type': 'text/html',
          'value': ' '
        }
      ],
      'template_id': global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_TEMPLATE_ABIBAO_EMAIL_RECOVERY')
    }
    sendgrid.API(request, function (response) {
      if (response.statusCode === 202) {
        console.log('... sendgrid code=%s', response.statusCode)
        resolve()
      } else {
        console.log('... sendgrid error code=%s', response.statusCode)
        reject(response)
      }
    })
  })
}

console.log('===== START ===============')

engine()
  .then(function () {
    knex('t_user')
      .select()
      .then(function (tUsers) {
        usersOld.push(tUsers[0])
        async.mapLimit(usersOld, 50, function (item, next) {
          console.log('%s', item['user_email'])
          item['user_password'] = 'CreateFromNothing'
          stepUser(item)
            .then(function (user) {
              if (user) {
                user.id = global.ABIBAO.services.domain.getIDfromURN(user.urn)
                usersNew.push(user)
              }
              item.urn = user.urn
              item.individual = user.id
              return stepData(item)
            })
            .then(function () {
              return global.ABIBAO.services.domain.execute('command', 'individualCreateFingerprintTokenCommand', {
                urn: item.urn,
                email: item['user_email']
              })
            })
            .then(function (fingerprint) {
              item.fingerprint = fingerprint
              return stepEmail(item)
            })
            .then(function () {
              next()
            })
            .catch(function (error) {
              console.log(error)
            })
        }, function () {
          console.log(errorsCSPS)
          console.log('usersOld=%s', usersOld.length)
          console.log('usersNew=%s', usersNew.length)
          console.log('===== END ===============')
          process.exit(0)
          knex.destroy()
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  })
