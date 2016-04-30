'use strict'

var Promise = require('bluebird')

var sendgrid = require('sendgrid')(global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_API_KEY'))

module.exports = function (emailTo) {
  return new Promise(function (resolve, reject) {
    try {
      var email = new sendgrid.Email({
        to: [emailTo],
        from: 'team@abibao.com',
        fromname: 'Team Abibao',
        subject: 'Welcome to Abibao',
        text: ' ',
        html: ' '
      })
      email.addCategory('individual_welcome')
      email.addSubstitution('%urn_survey%', global.ABIBAO.nconf.get('ABIBAO_WEB_DASHBOARD_URI'))
      email.addFilter('templates', 'enable', 1)
      email.addFilter('templates', 'template_id', global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_TEMPLATE_INDIVIDUAL_WELCOME'))
      sendgrid.send(email, function (error, json) {
        if (error) { return reject(error) }
        resolve(json)
      })
    } catch (e) {
      reject(e)
    }
  })
}
