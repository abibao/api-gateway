"use strict";

var chai = require('chai');
var should = chai.should;
var expect = chai.expect;

var Individual = require('../src/models/individual');

var individual, data;

describe('individual schema', function () {
  it('should return errors on validation email', function (done) {
    data = {
      email: 'email'
    };
    individual = new Individual(data);
    individual.validate(function(err, value) {
      expect(err).to.be.not.null;
      done();
    });
  });
  it('should return error on validation password empty', function (done) {
    data = {
      email: 'email@email.com'
    };
    individual = new Individual(data);
    individual.validate(function(err, value) {
      expect(err).to.be.not.null;
      done();
    });
  });
  it('should return error on validation date empty', function (done) {
    data = {
      email: 'email@email.com',
      hashedPassword: 'hashedPassword'
    };
    individual = new Individual(data);
    individual.validate(function(err, value) {
      expect(err).to.be.not.null;
      done();
    });
  });
  it('should return no error on validation ! perfect validation done !', function (done) {
    data = {
      email: 'email@email.com',
      hashedPassword: 'hashedPassword',
      created: Date.now()
    };
    individual = new Individual(data);
    individual.validate(function(err, value) {
      expect(err).to.be.null;
      done();
    });
  });
});