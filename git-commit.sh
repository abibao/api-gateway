#!/bin/bash

npm test

git add -i
git commit -m "$2"
git push origin $1