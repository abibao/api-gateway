"use strict";

var rp = require('request-promise');

var uri = 'http://gperreymond-abibao.c9.io';

var options = {
  method: 'POST',
  uri: uri+'/v1/administrators/login',
  form: {
    email: 'gilles@abibao.com',
    password: 'azer1234'
  }
};

rp(options)
.then(function(body) {
  console.log(body);
})
.catch(function (err) {
  console.log(err);
});