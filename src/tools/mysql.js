#!/usr/bin/env node
'use strict'

var program = require('commander')
program
  .version('1.0.0')
  .command('test', 'test mysql connection')
  .command('users', 'create or update users in mysql from cache')
  .command('answers', 'create or update answers in mysql from cache')
  .parse(process.argv)
