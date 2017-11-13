#!/bin/bash

# Simple testing script that generates a project using the CLI

set -e

CWD=`pwd`
TEST_FOLDER=$CWD/test-cli

function cleanup() {
    cd $CWD
    rm -rf $TEST_FOLDER
}

# Cleanup test folder in case of error
trap cleanup ERR

# Test add-on generation
mkdir -p $TEST_FOLDER
cd $TEST_FOLDER

ngx new --addon --no-analytics --automate "$CWD/test/addon.json" "Sample Add-on"
npm run test

cleanup

# Test app generation
mkdir -p $TEST_FOLDER
cd $TEST_FOLDER

ngx new --no-analytics --automate "$CWD/test/app.json" "Sample App"
npm run test:ci
npm run e2e

cleanup
