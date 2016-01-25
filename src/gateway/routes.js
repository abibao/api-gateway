"use strict";

var AuthController = require('./controllers/auth');
var LoginsController = require('./controllers/logins');
var IndividualsController = require('./controllers/individuals');
var AdministratorsController = require('./controllers/administrators');
var SurveysController = require('./controllers/surveys');
var EntitiesController = require('./controllers/entities');
var TestsController = require('./controllers/tests');

exports.endpoints = [
  
  /** NO AUTH **/
  
  // tests
  { method: 'GET', path: '/api/v1/tests', config: TestsController.get},
  { method: 'DELETE', path: '/api/v1/tests', config: TestsController.delete},
  { method: 'POST', path: '/api/v1/tests', config: TestsController.post},
  { method: 'PATCH', path: '/api/v1/tests', config: TestsController.patch},
  
  // individuals
  { method: 'POST', path: '/api/v1/individuals/login', config: LoginsController.login_individual},
  { method: 'POST', path: '/api/v1/individuals/register', config: IndividualsController.register},
  { method: 'GET', path: '/api/v1/individuals/verify/email/{token}', config: IndividualsController.verify_email},
  { method: 'GET', path: '/api/v1/individuals/count', config: IndividualsController.count},
  
  // administrators
  { method: 'POST', path: '/api/v1/administrators/login', config: LoginsController.login_administrator},
  { method: 'POST', path: '/api/v1/administrators/register', config: AdministratorsController.register},
  
  // auth
  { method: 'GET', path: '/api/v1/auth/me', config: AuthController.me},
  { method: 'POST', path: '/api/v1/auth/verify/email/resend', config: IndividualsController.resend_verification_email},
  { method: 'GET', path: '/api/v1/auth/surveys', config: AuthController.surveys_list},
  
  // entities
  { method: 'GET', path: '/api/v1/entities', config: EntitiesController.list},
  { method: 'GET', path: '/api/v1/entities/{id}', config: EntitiesController.read},
  { method: 'POST', path: '/api/v1/entities/create', config: EntitiesController.create},
  
  // surveys
  { method: 'GET', path: '/api/v1/surveys/{id}', config: SurveysController.read},
  { method: 'POST', path: '/api/v1/surveys/create', config: SurveysController.create},
  { method: 'POST', path: '/api/v1/surveys/{id}/constants/create', config: SurveysController.crup_constant},
  { method: 'PATCH', path: '/api/v1/surveys/{id}/constants/update', config: SurveysController.crup_constant},
  { method: 'POST', path: '/api/v1/surveys/{id}/item/create', config: SurveysController.create_item},
   
];