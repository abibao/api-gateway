#!/bin/bash

clear

export CODACY_PROJECT_TOKEN=81efd5f3bef1435188fa264d5dc98475
rm -rf coverage
node_modules/.bin/istanbul cover node_modules/.bin/_mocha --report lcovonly -- --timeout 15000 -R spec
cat coverage/lcov.info | node_modules/.bin/codacy-coverage
rm -rf coverage

node_modules/.bin/snyk test
node_modules/.bin/snyk monitor
ncu
