#!/bin/bash

clear

cp ./src/public/index.html ./build/
cp ./src/public/favicon.ico ./build/
cp -a ./src/public/images ./build/

./node_modules/.bin/webpack-dev-server --history-api-fallback --progress --host 0.0.0.0 --port 8484
