#!/bin/sh
set -e

CACHE_PATH=$(pwd)/src/tools/.cache/prod/rethinkdb
echo $CACHE_PATH

node ./src/batchs/import-campaigns.js $CACHE_PATH
# node ./src/batchs/import-entities.js $CACHE_PATH
# node ./src/batchs/import-campaigns-items.js $CACHE_PATH
# node ./src/batchs/import-campaigns-items-choices.js $CACHE_PATH
