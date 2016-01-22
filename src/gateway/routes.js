"use strict";

var AuthController = require('./controllers/auth');
var LoginsController = require('./controllers/logins');
var IndividualsController = require('./controllers/individuals');
var AdministratorsController = require('./controllers/administrators');
var SurveysController = require('./controllers/surveys');
var TestsController = require('./controllers/tests');

exports.endpoints = [
  
  /** NO AUTH **/
  
  // tests
  { method: 'GET', path: '/api/v1/tests', config: TestsController.get},
  { method: 'DELETE', path: '/api/v1/tests', config: TestsController.delete},
  { method: 'POST', path: '/api/v1/tests', config: TestsController.post},
  { method: 'PATCH', path: '/api/v1/tests', config: TestsController.patch},
  
  // individuals
  { method: 'POST', path: '/api/v1/individuals/login', config: LoginsController.login_individual}, // DONE
  { method: 'POST', path: '/api/v1/individuals/register', config: IndividualsController.register}, // DONE
  { method: 'POST', path: '/api/v1/individuals/verify/email/resend', config: IndividualsController.resend_verification_email}, // DONE
  { method: 'GET', path: '/api/v1/individuals/verify/email/{token}', config: IndividualsController.verify_email}, // DONE
  { method: 'POST', path: '/api/v1/individuals/count', config: IndividualsController.count}, // DONE
  
  // administrators
  { method: 'POST', path: '/api/v1/administrators/login', config: LoginsController.login_administrator}, // DONE
  /*{ method: 'POST', path: '/api/v1/administrators/register', config: AdministratorsController.register}, // DONE*/
  
  /** AUTH ALL **/
  
  // auth
  { method: 'GET', path: '/api/v1/auth/me', config: AuthController.me},
  
  /** AUTH INDIVIDUAL **/
  
  // auth
  //{ method: 'GET', path: '/api/v1/auth/surveys', config: AuthController.surveyslist},
  //{ method: 'PATCH', path: '/api/v1/auth/me/update', config: AuthController.me_update},
  
  /** AUTH ADMINISTRATOR **/
  
  // individuals
  //{ method: 'GET', path: '/api/v1/individuals/count', config: IndividualsController.count},
  //{ method: 'GET', path: '/api/v1/individuals/shortlist/{startIndex}/{nbIndexes}', config: IndividualsController.readshortlist},
  //{ method: 'PATCH', path: '/api/v1/individuals/{id}/update', config: IndividualsController.update},
  
  // surveys
  //{ method: 'POST', path: '/api/v1/surveys/create', config: SurveysController.create},
  //{ method: 'GET', path: '/api/v1/surveys/{id}/status', config: SurveysController.status},
   
];