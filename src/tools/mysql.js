#!/usr/bin/env node
'use strict'

var program = require('commander')
program
  .version('1.0.0')
  .command('users', 'create or update users in mysql from cache')
  .parse(process.argv)
