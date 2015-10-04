'use-strict';

var IndividualsController = require('./controllers/individuals');
var AuthController = require('./controllers/auth');

exports.endpoints = [
  // individuals
  { method: 'GET', path: '/individuals/alive', config: IndividualsController.alive},
  { method: 'POST', path: '/individuals/login', config: IndividualsController.login},
  { method: 'GET', path: '/individuals/list', config: IndividualsController.list},
  // auth
  { method: 'GET', path: '/auth/me', config: AuthController.me}
  /*
  { method: 'POST', path: '/individuals/register', config: IndividualsController.register}
  */
];