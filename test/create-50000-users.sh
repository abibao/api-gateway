#!/bin/bash

numero=1

while test $numero != 50001
  do
  curl -X POST --header 'Content-Type: application/x-www-form-urlencoded' --header 'Accept: application/json' --header 'Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY3Rpb24iOiJhdXRoX21lIiwiaWQiOiI1NmExZjYyZjA5NWYzNTg4MGUxMTcyN2MiLCJzY29wZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE0NTUwNDk4MDEsImV4cCI6MTQ1NTEzNjIwMX0.Q1zfVP8bcEtg63eKfQzNz8JwZ1NO2a4DmEKpw_o3KSo' -d 'email=wftemail'$numero'%40gmail.com&scope=individual&verified=false' 'http://gperreymond-abibao.c9.io/api/v1/users'
  numero=$(($numero + 1))
done