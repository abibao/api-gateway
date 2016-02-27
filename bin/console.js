"use strict";

// declare internal libraries
// ...

// declare external libraries
var clc = require("cli-color");

// declare project libraries
// ...

// initialize color console
var error = clc.red.bold,
    warning = clc.yellow.bold,
    notice = clc.blue.bold;

module.exports = {
  error: function(message, options) {
    ( options===undefined) ? console.log(error(message)) : console.log(error(message)+options);
  },
  warning: function(message, options) {
    ( options===undefined ) ? console.log(warning(message)) : console.log(warning(message)+options);
  },
  notice: function(message, options) {
    ( options===undefined ) ? console.log(notice(message)) : console.log(notice(message)+options);
  }
};