#!/usr/bin/env node
'use strict'

var program = require('commander')
program
  .version('1.0.0')
  .command('export', 'export table(s) to file(s)')
  .command('import', 'import file(s) to table(s)')
  .command('list', 'list all tables', {isDefault: true})
  .parse(process.argv)
