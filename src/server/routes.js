'use strict'

exports.endpoints = [

  // server is alive
  { method: 'GET', path: '/v1/alive', config: require('./handlers/alive') },

  // stats
  { method: 'GET', path: '/v1/stats/charities/individuals', config: require('./handlers/stats/charities/individuals') },
  { method: 'GET', path: '/v1/stats/charities/none', config: require('./handlers/stats/charities/none') },
  { method: 'GET', path: '/v1/stats/individuals/genders', config: require('./handlers/stats/individuals/genders') },
  { method: 'GET', path: '/v1/stats/individuals/ages/{gender}', config: require('./handlers/stats/individuals/ages') },

  // www - administrator
  { method: 'GET', path: '/administrator/{param*}', config: require('./handlers/administrator') },

  // auto affect campaign
  { method: 'GET', path: '/redirect/individual/assign/campaign/{sealed}', config: require('./handlers/redirect/campaign/assign') },
  { method: 'GET', path: '/redirect/campaign/assign/{sealed}', config: require('./handlers/redirect/campaign/assign-abibao') },

  // individuals
  { method: 'POST', path: '/v1/individuals/autologin/{fingerprint}', config: require('./handlers/individuals/autologin') },
  { method: 'POST', path: '/v1/individuals/login', config: require('./handlers/individuals/login') },
  { method: 'POST', path: '/v1/individuals/register', config: require('./handlers/individuals/register') },
  { method: 'GET', path: '/v1/auth/global/informations', config: require('./handlers/individuals/auth/globalInformations') },
  { method: 'PATCH', path: '/v1/auth/charity', config: require('./handlers/individuals/auth/charity/update') },
  { method: 'GET', path: '/v1/auth/surveys/{urn}', config: require('./handlers/individuals/auth/surveys/read') },
  { method: 'POST', path: '/v1/auth/surveys/{urn}/answers', config: require('./handlers/individuals/auth/surveys/answer') },

  // wordpress > smf
  { method: 'GET', path: '/v1/wp_json/smf/startups/scores', config: require('./handlers/smf/startups/scores') },
  { method: 'GET', path: '/v1/wp_json/smf/startups/{wpid}', config: require('./handlers/smf/startups/read') },
  { method: 'GET', path: '/v1/wp_json/smf/startups/{wpid}/score', config: require('./handlers/smf/startups/points') },
  { method: 'POST', path: '/v1/wp_json/smf/startups/{wpid}/vote', config: require('./handlers/smf/startups/vote') },

  // administrators
  { method: 'POST', path: '/v1/administrators/login', config: require('./handlers/backoffice/administrators/login') },
  { method: 'POST', path: '/v1/administrators/register', config: require('./handlers/backoffice/administrators/register') },

  // entities
  { method: 'GET', path: '/v1/entities/charity', config: require('./handlers/entities/charity') },
  { method: 'GET', path: '/v1/entities', config: require('./handlers/entities/list') },
  { method: 'POST', path: '/v1/entities', config: require('./handlers/entities/create') },
  { method: 'GET', path: '/v1/entities/{urn}', config: require('./handlers/entities/read') },
  { method: 'PATCH', path: '/v1/entities/{urn}', config: require('./handlers/entities/update') },
  { method: 'GET', path: '/v1/entities/{urn}/campaigns', config: require('./handlers/entities/campaigns/list') },

  // campaigns
  { method: 'GET', path: '/v1/campaigns', config: require('./handlers/campaigns/list') },
  { method: 'POST', path: '/v1/campaigns', config: require('./handlers/campaigns/create') },
  { method: 'GET', path: '/v1/campaigns/{urn}', config: require('./handlers/campaigns/read') },
  { method: 'PATCH', path: '/v1/campaigns/{urn}', config: require('./handlers/campaigns/update') },
  { method: 'POST', path: '/v1/campaigns/{urn}/affect', config: require('./handlers/campaigns/affect') },

  // choices
  { method: 'POST', path: '/v1/choices', config: require('./handlers/campaigns/items/choices/create') },
  { method: 'GET', path: '/v1/choices/{urn}', config: require('./handlers/campaigns/items/choices/read') },
  { method: 'PATCH', path: '/v1/choices/{urn}', config: require('./handlers/campaigns/items/choices/update') },

  // components
  { method: 'GET', path: '/v1/campaigns/items/{urn}', config: require('./handlers/campaigns/items/read') },
  { method: 'PATCH', path: '/v1/campaigns/items/{urn}', config: require('./handlers/campaigns/items/update') },
  { method: 'POST', path: '/v1/campaigns/items/short-text', config: require('./handlers/campaigns/items/componentShortText/create') },
  { method: 'POST', path: '/v1/campaigns/items/long-text', config: require('./handlers/campaigns/items/componentLongText/create') },
  { method: 'POST', path: '/v1/campaigns/items/multiple-choice', config: require('./handlers/campaigns/items/componentMultipleChoice/create') },
  { method: 'POST', path: '/v1/campaigns/items/yes-no', config: require('./handlers/campaigns/items/componentYesNo/create') },
  { method: 'POST', path: '/v1/campaigns/items/statement', config: require('./handlers/campaigns/items/componentStatement/create') },
  { method: 'POST', path: '/v1/campaigns/items/dropdown', config: require('./handlers/campaigns/items/componentDropdown/create') },
  { method: 'POST', path: '/v1/campaigns/items/number', config: require('./handlers/campaigns/items/componentNumber/create') }

]
