#!/bin/bash
set -e

export CODACY_PROJECT_TOKEN=3862e173a5284d0984ee3bb50d6a8f24
rm -rf coverage

export ABIBAO_API_GATEWAY_RETHINKDB_DATABASE=test
export ABIBAO_API_GATEWAY_POSTGRES_DATABASE=test
node_modules/.bin/istanbul cover node_modules/.bin/_mocha -- --opts .mocharc

cat coverage/lcov.info | node_modules/.bin/codacy-coverage
