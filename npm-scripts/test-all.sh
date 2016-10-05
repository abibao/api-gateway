#!/bin/bash

clear

npm run standard:snazzy

export CODACY_PROJECT_TOKEN=3862e173a5284d0984ee3bb50d6a8f24
rm -rf coverage
node_modules/.bin/istanbul cover node_modules/.bin/_mocha --report lcovonly -- --timeout 15000 -R spec
cat coverage/lcov.info | node_modules/.bin/codacy-coverage
