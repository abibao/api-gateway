#!/bin/sh
set -e

./src/tools/rethinkdb.js export all rece
./src/tools/mysql.js users rece
./src/tools/mysql.js answers rece
