#!/bin/bash

set -a
clear

export CODACY_PROJECT_TOKEN=3862e173a5284d0984ee3bb50d6a8f24
rm -rf coverage

npm run test:standard
npm run test:coverage
npm run test:security

cat coverage/lcov.info | node_modules/.bin/codacy-coverage
