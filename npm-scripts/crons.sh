#!/bin/bash

set -e
clear

node tools/rethink_dump_export.js
node tools/mysql_create_answers.js
node tools/mysql_create_users.js
