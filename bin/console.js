"use strict";

// declare internal libraries
// ...

// declare external libraries
var clc = require("cli-color");
var _ = require("lodash");

// declare project libraries
// ...

// initialize color console
var error = clc.red.bold,
    warning = clc.yellow.bold,
    notice = clc.blue.bold;

module.exports = {
  error(message, options) {
    ( _.isUndefined(options) ) ? console.log(error(message)) : console.log(error(message)+options);
  },
  warning(message, options) {
    ( _.isUndefined(options) ) ? console.log(warning(message)) : console.log(warning(message)+options);
  },
  notice(message, options) {
    ( _.isUndefined(options) ) ? console.log(notice(message)) : console.log(notice(message)+options);
  }
};