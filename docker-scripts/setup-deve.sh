#!/bin/sh

# script/setup-deve- make sure all required dependencies are setup for developpement

# exit on sub-module failure
set -e

# ./docker-scripts/ci-bootstrap-container.sh "mysql" "deve_mysql" "-p 3306:3306 -e MYSQL_ROOT_PASSWORD=none" "library/mysql:5"
# ./docker-scripts/wait-for-it.sh -h localhost -p 3306

# ./docker-scripts/ci-bootstrap-container.sh "rabbitmq" "deve_rabbitmq" "-p 5672:5672 -p 15672:15672 -e RABBITMQ_PASS=none" "tutum/rabbitmq:latest"
# ./docker-scripts/wait-for-it.sh -h localhost -p 15672

./docker-scripts/ci-bootstrap-container.sh "rethinkdb" "deve_rethinkdb" "-p 39015:29015 -p 38015:28015 -p 8787:8080" "library/rethinkdb"
./docker-scripts/wait-for-it.sh -h localhost -p 8080
