'use strict'

const Iron = require('iron')
const Base64 = require('base64-url')

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

const message = {
  action: 'abibao_campaign_publish_auto',
  individual: 'urn:abibao:database:individual:ffd98885c215fbce5999ba22cdededd3a195cbd19a6c4839',
  charity: 'urn:abibao:database:entity:ffd68c859145f29f0893be25caede9d4a2c69b86986b1d35',
  campaign: 'urn:abibao:database:campaign:ffd98edfcd46f7995b9bb47499bde9d1a2c19cdd99391932'
}

var sealed = ''
Iron.seal(message, global.ABIBAO.config('ABIBAO_API_GATEWAY_CRYPTO_CREDENTIALS'), Iron.defaults, function (error, result) {
  if (error) {
    console.log(error)
    return process.exit(1)
  }
  sealed = Base64.encode(result)
  console.log(sealed)
  process.exit(0)
})
