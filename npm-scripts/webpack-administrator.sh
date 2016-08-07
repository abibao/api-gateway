#!/bin/bash

clear

cp ./src/public/administrator/index.html ./build/administrator/
cp ./src/public/administrator/favicon.ico ./build/administrator/
cp -a ./src/public/administrator/images ./build/administrator/

./node_modules/.bin/webpack-dev-server --config ./webpack-administrator.config.js --history-api-fallback --progress --host 0.0.0.0 --port 8484
