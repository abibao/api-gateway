#!/bin/sh
set -e

sudo sysctl -w vm.max_map_count=262144

docker-compose down
docker-compose up -d --build
