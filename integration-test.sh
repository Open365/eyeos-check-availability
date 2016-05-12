#!/bin/bash
set -e

./node_modules/.bin/_mocha -u tdd integration-test --timeout 10000
