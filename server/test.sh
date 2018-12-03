#!/usr/bin/env bash

TESTS="server/test/tests"

if [ $# -ne 0 ]
 then
 TESTS="server/test/tests/$1.js"
fi

echo "- - - - - - - - - - -"
echo "- refreshing testdb -"
echo "- - - - - - - - - - -"

npm run resetdb:localtest

echo "- - - - - - - - -"
echo "- running tests -"
echo "- - - - - - - - -"

node ./node_modules/lab/bin/lab ${TESTS} --timeout 10000 -e localtest

echo "- - - - - - -"
echo "- finished  -"
echo "- - - - - - -"
