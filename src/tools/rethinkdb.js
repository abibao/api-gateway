#!/usr/bin/env node
'use strict'

var program = require('commander')
program
  .version('1.0.0')
  .command('export', 'export a table to file')
  .command('import', 'import with a file to a table')
  .command('list', 'list all tables', {isDefault: true})
  .parse(process.argv)
