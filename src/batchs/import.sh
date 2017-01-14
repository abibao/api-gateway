#!/bin/sh
set -e

CACHE_PATH=$(pwd)/src/tools/.cache/prod/rethinkdb
echo $CACHE_PATH

# node ./src/batchs/import.js $CACHE_PATH surveys,entities,campaigns,campaigns-items,campaigns-items-choices
node ./src/batchs/import.js $CACHE_PATH entities,campaigns,campaigns-items,campaigns-items-choices
