'use strict'

var Promise = require('bluebird')

var Hoek = require('hoek')

module.exports = function (payload) {
  var self = Hoek.clone(global.ABIBAO.services.domain)
  return new Promise(function (resolve, reject) {
    var individual
    if (!payload.backUrl) { return reject(new Error('ERROR_BAD_AUTHENTIFICATION_BACKURL_NOT_FOUND')) }
    // email to lowercase
    payload.email = payload.email.toLowerCase()
    // email in individuals or not ?
    self.execute('query', 'individualFilterQuery', {email: payload.email})
      .then(function (individuals) {
        if (individuals.length === 0) { return reject(new Error('ERROR_BAD_AUTHENTIFICATION_EMAIL_NOT_FOUND')) }
        if (individuals.length > 1) { return reject(new Error('ERROR_BAD_AUTHENTIFICATION_EMAIL_DUPLICATE')) }
        individual = individuals[0]
        if (individual.password === undefined) { return reject(new Error('ERROR_BAD_AUTHENTIFICATION_PASSWORD_NOT_FOUND')) }
        if (individual.scope !== payload.scope) { return reject(new Error('ERROR_BAD_AUTHENTIFICATION_BAD_SCOPE')) }
        return global.ABIBAO.services.server.service('users').find({urn: individual.urn})
      })
      // user in memory or not ?
      .then(function (users) {
        if (users.length === 0) {
          var roles = []
          roles.push(payload.scope)
          if (payload.scope === 'administrator') roles.push('individual')
          var user = {
            urn: individual.urn,
            email: individual.email,
            password: individual.password,
            roles: roles
          }
          return global.ABIBAO.services.server.service('users').create(user)
        } else {
          return global.ABIBAO.services.server.service('users').get(users[0].id)
        }
      })
      // now create fingerprint
      .then(function (user) {
        return global.ABIBAO.services.domain.execute('command', 'fingerprintTokenCreateCommand', {
          action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_EMAIL_VERIFICATION,
          email: individual.email,
          password: individual.password
        })
      })
      .then(function (fingerprint) {
        // send email for autologin
        var sendgrid = require('sendgrid').SendGrid(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))
        var request = sendgrid.emptyRequest()
        request.method = 'POST'
        request.path = '/v3/mail/send'
        request.body = {
          'personalizations': [
            {
              'to': [
                { 'email': payload.email }
              ],
              'subject': 'Vérification de votre identité',
              'substitutions': {
                '%fingerprint%': payload.backUrl + '=' + fingerprint
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
          'template_id': global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_TEMPLATE_ABIBAO_AUTOLOGIN')
        }
        sendgrid.API(request, function (response) {
          if (response.statusCode === 202) {
            return resolve(fingerprint)
          } else {
            return reject(new Error('ERROR_BAD_AUTHENTIFICATION_SENDGRID_ERROR'))
          }
        })
      })
      .catch(function (error) {
        return reject(new Error(error))
      })
  })
}
