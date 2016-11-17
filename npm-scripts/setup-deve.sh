#!/bin/sh
set -e

node_modules/.bin/_mocha --timeout 5000 --use_strict --recursive test/rethinkdb-structure.test.js
node_modules/.bin/_mocha --timeout 5000 --use_strict --recursive test/mysql-structure.test.js
