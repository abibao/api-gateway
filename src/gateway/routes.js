"use strict";

var AuthController = require('./controllers/auth');
var IndividualsController = require('./controllers/individuals');
var AdministratorsController = require('./controllers/administrators');
var CampaignsController = require('./controllers/campaigns');
var EntitiesController = require('./controllers/entities');
var TestsController = require('./controllers/tests');

exports.endpoints = [

  // tests
  { method: 'GET', path: '/api/v1/tests', config: TestsController.get },
  { method: 'DELETE', path: '/api/v1/tests', config: TestsController.delete },
  { method: 'POST', path: '/api/v1/tests', config: TestsController.post },
  { method: 'PATCH', path: '/api/v1/tests', config: TestsController.patch },
  
  // individuals
  { method: 'POST', path: '/api/v1/individuals/login', config: IndividualsController.login },
  { method: 'POST', path: '/api/v1/individuals/register', config: IndividualsController.register },
  { method: 'POST', path: '/api/v1/individuals/verify/email/{token}', config: IndividualsController.verify_email },
  { method: 'POST', path: '/api/v1/individuals/assign/campaign/{token}', config: IndividualsController.assign_campaign },
  { method: 'POST', path: '/api/v1/individuals/surveys/{id}/answer', config: IndividualsController.survey_answer },
  { method: 'GET', path: '/api/v1/individuals/count', config: IndividualsController.count },
  
  // administrators
  { method: 'POST', path: '/api/v1/administrators/login', config: AdministratorsController.login },
  { method: 'POST', path: '/api/v1/administrators/register', config: AdministratorsController.register },
  
  // auth
  { method: 'GET', path: '/api/v1/auth/me', config: AuthController.me },
  { method: 'POST', path: '/api/v1/auth/verify/email/resend', config: AuthController.resend_verification_email },
  
  // entities
  { method: 'GET', path: '/api/v1/entities', config: EntitiesController.list },
  { method: 'GET', path: '/api/v1/entities/{id}', config: EntitiesController.read },
  { method: 'POST', path: '/api/v1/entities/{id}/campaigns/create', config: EntitiesController.create_campaign },
  { method: 'POST', path: '/api/v1/entities/{id}/campaigns/publish', config: EntitiesController.publish_campaign },
  { method: 'GET', path: '/api/v1/entities/{id}/campaigns', config: EntitiesController.list_campaigns },
  { method: 'POST', path: '/api/v1/entities/create', config: EntitiesController.create },
  
  // campaigns
  { method: 'GET', path: '/api/v1/campaigns/{id}', config: CampaignsController.read },
  { method: 'POST', path: '/api/v1/campaigns/{id}/constants/create', config: CampaignsController.create_constant },
  { method: 'PATCH', path: '/api/v1/campaigns/{id}/constants/update', config: CampaignsController.update_constant },
  { method: 'DELETE', path: '/api/v1/campaigns/{id}/constants/delete', config: CampaignsController.delete_constant },
  { method: 'POST', path: '/api/v1/campaigns/{id}/item/create', config: CampaignsController.create_item },
   
];