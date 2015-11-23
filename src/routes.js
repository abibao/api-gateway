"use strict";

var IndividualsController = require('./controllers/individuals');
var AuthController = require('./controllers/auth');

exports.endpoints = [
  // individuals
  { method: 'POST', path: '/individuals/login', config: IndividualsController.login},
  { method: 'POST', path: '/individuals/register', config: IndividualsController.register},
  { method: 'GET', path: '/individuals/count', config: IndividualsController.count},
  { method: 'POST', path: '/individuals/shortlist', config: IndividualsController.readshortlist},
  { method: 'GET', path: '/individuals/{id}/short', config: IndividualsController.readshort},
  // auth
  { method: 'GET', path: '/auth/me', config: AuthController.me}
];