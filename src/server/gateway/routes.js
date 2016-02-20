"use strict";

var normalize = require('path').normalize;
var resolve = require('path').resolve;

var AuthController = require('./controllers/auth');
var IndividualsController = require('./controllers/individuals');
var AdministratorsController = require('./controllers/administrators');
var CampaignsController = require('./controllers/campaigns');
var EntitiesController = require('./controllers/entities');

exports.endpoints = [
  
  // www - dashboard
  { method: 'GET', path: '/dashboard/{param*}', handler: { directory: { defaultExtension: 'html', path: normalize(resolve(__dirname,'../..','www/dashboard')) } } },
  
  // individuals
  { method: 'POST', path: '/v1/individuals/login', config: IndividualsController.login }, // done
  { method: 'POST', path: '/v1/individuals/register', config: IndividualsController.register }, // done
  { method: 'POST', path: '/v1/individuals/campaigns/assign/{token}', config: IndividualsController.campaigns_assign },
  { method: 'GET', path: '/v1/individuals/count', config: IndividualsController.count },
  
  // administrators
  { method: 'POST', path: '/v1/administrators/login', config: AdministratorsController.login }, // done
  { method: 'POST', path: '/v1/administrators/register', config: AdministratorsController.register }, // done
  
  // auth
  { method: 'GET', path: '/v1/auth/global/informations', config: AuthController.global_informations },
  { method: 'POST', path: '/v1/auth/surveys/{urn}/answers', config: AuthController.surveys_answers },
  { method: 'GET', path: '/v1/auth/surveys/{urn}', config: AuthController.surveys_read },
  
  // entities
  { method: 'GET', path: '/v1/entities', config: EntitiesController.list }, // done
  { method: 'POST', path: '/v1/entities', config: EntitiesController.create }, // done
  { method: 'GET', path: '/v1/entities/{urn}', config: EntitiesController.read }, // done
  { method: 'PATCH', path: '/v1/entities/{urn}', config: EntitiesController.update }, // done
  { method: 'POST', path: '/v1/entities/{urn}/campaigns/publish', config: EntitiesController.campaigns_publish },
  { method: 'GET', path: '/v1/entities/{urn}/campaigns', config: EntitiesController.campaigns_list },
  
  // campaigns
  { method: 'GET', path: '/v1/campaigns', config: CampaignsController.list }, // done
  { method: 'POST', path: '/v1/campaigns', config: CampaignsController.create }, // done
  { method: 'GET', path: '/v1/campaigns/{urn}', config: CampaignsController.read }, // done
  { method: 'POST', path: '/v1/campaigns/{urn}/constants', config: CampaignsController.constants_create },
  { method: 'PATCH', path: '/v1/campaigns/{urn}/constants', config: CampaignsController.constants_update },
  { method: 'DELETE', path: '/v1/campaigns/{urn}/constants', config: CampaignsController.constants_delete },
  { method: 'POST', path: '/v1/campaigns/{urn}/items', config: CampaignsController.items_create },
  
];

//{ method: 'POST', path: '/v1/auth/resend/verification/email', config: AuthController.resend_verification_email },
//{ method: 'POST', path: '/v1/individuals/verify/email/{token}', config: IndividualsController.verify_email },