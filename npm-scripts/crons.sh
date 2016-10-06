#!/bin/bash

set -a
clear

node tools/rethink_backup.js
node tools/mysql_create_answers.js
node tools/mysql_create_users.js
node tools/mysql_insert_answers.js
node tools/mysql_insert_users.js
