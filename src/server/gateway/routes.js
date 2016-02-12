"use strict";

var AuthController = require('./controllers/auth');
var IndividualsController = require('./controllers/individuals');
var AdministratorsController = require('./controllers/administrators');
var CampaignsController = require('./controllers/campaigns');
var EntitiesController = require('./controllers/entities');

exports.endpoints = [

  // individuals
  { method: 'POST', path: '/v1/individuals/login', config: IndividualsController.login },
  { method: 'POST', path: '/v1/individuals/register', config: IndividualsController.register },
  { method: 'POST', path: '/v1/individuals/verify/email/{token}', config: IndividualsController.verify_email },
  { method: 'POST', path: '/v1/individuals/campaigns/assign/{token}', config: IndividualsController.campaigns_assign },
  { method: 'GET', path: '/v1/individuals/count', config: IndividualsController.count },
  
  // administrators
  { method: 'POST', path: '/v1/administrators/login', config: AdministratorsController.login },
  { method: 'POST', path: '/v1/administrators/register', config: AdministratorsController.register },
  
  // auth
  { method: 'GET', path: '/v1/auth/global/informations', config: AuthController.global_informations },
  { method: 'POST', path: '/v1/auth/resend/verification/email', config: AuthController.resend_verification_email },
  { method: 'POST', path: '/v1/auth/surveys/{id}/answers', config: AuthController.surveys_answers },
  { method: 'GET', path: '/v1/auth/surveys/{id}', config: AuthController.surveys_read },
  
  // entities
  { method: 'GET', path: '/v1/entities', config: EntitiesController.list },
  { method: 'POST', path: '/v1/entities', config: EntitiesController.create },
  { method: 'GET', path: '/v1/entities/{id}', config: EntitiesController.read },
  { method: 'PATCH', path: '/v1/entities/{id}', config: EntitiesController.update },
  { method: 'POST', path: '/v1/entities/{id}/campaigns', config: EntitiesController.campaigns_create },
  { method: 'POST', path: '/v1/entities/{id}/campaigns/publish', config: EntitiesController.campaigns_publish },
  { method: 'GET', path: '/v1/entities/{id}/campaigns', config: EntitiesController.campaigns_list },
  
  // campaigns
  { method: 'GET', path: '/v1/campaigns/{id}', config: CampaignsController.read },
  { method: 'POST', path: '/v1/campaigns/{id}/constants', config: CampaignsController.constants_create },
  { method: 'PATCH', path: '/v1/campaigns/{id}/constants', config: CampaignsController.constants_update },
  { method: 'DELETE', path: '/v1/campaigns/{id}/constants', config: CampaignsController.constants_delete },
  { method: 'POST', path: '/v1/campaigns/{id}/items', config: CampaignsController.items_create },
  
];
