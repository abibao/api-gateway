"use strict";

var IndividualsController = require('./api/individuals');
var SurveysController = require('./api/surveys');
var AuthController = require('./api/auth');
var TestController = require('./api/test');

exports.endpoints = [
  
  /** NO AUTH **/
  
  // tests
  { method: 'GET', path: '/tests', config: TestController.get},
  { method: 'DELETE', path: '/tests', config: TestController.delete},
  { method: 'POST', path: '/tests', config: TestController.post},
  { method: 'PATCH', path: '/tests', config: TestController.patch},
  
  // individuals
  { method: 'POST', path: '/individuals/login', config: IndividualsController.login},
  { method: 'POST', path: '/individuals/register', config: IndividualsController.register},
  
  /** AUTH NORMAL**/
  
  // auth
  { method: 'GET', path: '/auth/me', config: AuthController.me},
  { method: 'GET', path: '/auth/surveys', config: AuthController.surveyslist},
  
  // surveys
  { method: 'GET', path: '/surveys/{id}/status', config: SurveysController.status},
  { method: 'POST', path: '/surveys/create', config: SurveysController.create},
  
  /** AUTH ADMIN **/
  
  // individuals
  { method: 'GET', path: '/individuals/count', config: IndividualsController.count},
  { method: 'GET', path: '/individuals/shortlist', config: IndividualsController.readshortlist},
   
];