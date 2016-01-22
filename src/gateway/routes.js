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
  { method: 'GET', path: '/api/v1/tests', config: TestsController.get}, // DONE
  { method: 'DELETE', path: '/api/v1/tests', config: TestsController.delete}, // DONE
  { method: 'POST', path: '/api/v1/tests', config: TestsController.post}, // DONE
  { method: 'PATCH', path: '/api/v1/tests', config: TestsController.patch}, // DONE
  
  // individuals
  { method: 'POST', path: '/api/v1/individuals/login', config: LoginsController.login_individual}, // DONE
  { method: 'POST', path: '/api/v1/individuals/register', config: IndividualsController.register}, // DONE
  { method: 'GET', path: '/api/v1/individuals/verify/email/{token}', config: IndividualsController.verify_email}, // DONE
  { method: 'GET', path: '/api/v1/individuals/count', config: IndividualsController.count}, // DONE
  //{ method: 'GET', path: '/api/v1/individuals/shortlist/{startIndex}/{nbIndexes}', config: IndividualsController.readshortlist},
  //{ method: 'PATCH', path: '/api/v1/individuals/{id}/update', config: IndividualsController.update},
  
  // administrators
  { method: 'POST', path: '/api/v1/administrators/login', config: LoginsController.login_administrator}, // DONE
  { method: 'POST', path: '/api/v1/administrators/register', config: AdministratorsController.register}, // DONE
  
  // auth
  { method: 'GET', path: '/api/v1/auth/me', config: AuthController.me},
  { method: 'POST', path: '/api/v1/auth/verify/email/resend', config: IndividualsController.resend_verification_email}, // DONE
  { method: 'GET', path: '/api/v1/auth/surveys', config: AuthController.surveys_list},
  //{ method: 'PATCH', path: '/api/v1/auth/update', config: AuthController.update},
  
  // surveys
  //{ method: 'POST', path: '/api/v1/surveys/create', config: SurveysController.create},
  //{ method: 'GET', path: '/api/v1/surveys/{id}/status', config: SurveysController.status},
   
];