'use strict'

module.exports = function (message) {
  global.ABIBAO.debuggers.bus('BUS_EVENT_SEND_EMAIL_FOR_AUTOLOGIN_WITH_FINGERPRINT with user=%o and fingerpint=%s', message.user, message.fingerpint)
  // create the fingerpint
  const data = {
    action: global.ABIBAO.constants.DomainConstant.ABIBAO_CONST_TOKEN_EMAIL_VERIFICATION,
    email: message.user.email,
    password: message.user.password,
    roles: message.user.roles
  }
  global.ABIBAO.services.domain.execute('command', 'fingerprintTokenCreateCommand', data)
    .then(function (result) {
      // send email
      const body = {
        'personalizations': [
          { 'to': [ { 'email': message.user.email } ],
            'subject': 'Vérification de votre identité',
            'substitutions': {
              '%fingerprint%': message.backUrl + '=' + result.data.fingerprint
            }
          }
        ],
        'from': { 'email': 'bonjour@abibao.com', 'name': 'Abibao' },
        'content': [ { 'type': 'text/html', 'value': ' ' } ],
        'template_id': global.ABIBAO.nconf.get('ABIBAO_API_GATEWAY_SENDGRID_TEMPLATE_ABIBAO_AUTOLOGIN')
      }
      global.ABIBAO.services.domain.execute('command', 'sendEmailFromSendgridCommand', body)
    })
}
