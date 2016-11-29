#!/usr/bin/env node
'use strict'

var program = require('commander')
program
  .version('1.0.0')
  .command('export', 'export table(s) to file(s)')
  .command('import', 'import file(s) to table(s)')
  .parse(process.argv)
