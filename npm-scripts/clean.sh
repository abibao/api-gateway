#!/bin/sh
set -e

npm prune
npm install
npm rebuild
