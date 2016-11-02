#!/bin/bash

# -----------------------
# cron to calculate analytics in mysql from data in rethinkdb
# -----------------------

# exit on sub-module failure
set -e

# export from rethink to disk
node tools/rethink_dump_export.js

# create on disk
node tools/mysql_create_users.js
node tools/mysql_create_answers.js

# import from disk to mysql
node tools/mysql_insert_users.js
node tools/mysql_insert_answers.js
