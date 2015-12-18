"use strict";

var AuthController = require('./api/auth');
var LoginsController = require('./api/logins');
var IndividualsController = require('./api/individuals');
var SurveysController = require('./api/surveys');
var TestsController = require('./api/tests');

exports.endpoints = [
  
  /** NO AUTH **/
  
  // tests
  { method: 'GET', path: '/tests', config: TestsController.get},
  { method: 'DELETE', path: '/tests', config: TestsController.delete},
  { method: 'POST', path: '/tests', config: TestsController.post},
  { method: 'PATCH', path: '/tests', config: TestsController.patch},
  
  // individuals
  { method: 'POST', path: '/individuals/login', config: LoginsController.login_individual},
  { method: 'POST', path: '/individuals/register', config: IndividualsController.register},
  { method: 'POST', path: '/individuals/verify/email/resend', config: IndividualsController.resendVerificationEmail},
  { method: 'GET', path: '/individuals/verify/email/{token}', config: IndividualsController.verifyEmail},
  
  // administrators
  { method: 'POST', path: '/administrators/login', config: LoginsController.login_administrator},
  
  /** AUTH ALL **/
  
  // auth
  { method: 'GET', path: '/auth/me', config: AuthController.me},
  
  /** AUTH INDIVIDUAL **/
  
  // auth
  { method: 'GET', path: '/auth/surveys', config: AuthController.surveyslist},

  /** AUTH ADMINISTRATOR **/
  
  // individuals
  { method: 'GET', path: '/individuals/count', config: IndividualsController.count},
  { method: 'GET', path: '/individuals/shortlist/{startIndex}/{nbIndexes}', config: IndividualsController.readshortlist},
  
  // surveys
  { method: 'POST', path: '/surveys/create', config: SurveysController.create},
  { method: 'GET', path: '/surveys/{id}/status', config: SurveysController.status},
   
];