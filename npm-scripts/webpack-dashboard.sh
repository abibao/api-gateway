#!/bin/bash

clear

cp ./src/public/dashboard/index.html ./build/dashboard/
cp ./src/public/dashboard/favicon.ico ./build/dashboard/
cp -a ./src/public/dashboard/images ./build/dashboard/

./node_modules/.bin/webpack-dev-server --config ./webpack-dashboard.config.js --history-api-fallback --progress --host 0.0.0.0 --port 8484
