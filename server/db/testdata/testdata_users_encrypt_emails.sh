#!/usr/bin/env bash

declare -a emails=("admin@test.com" "test@test.com" "disabled@test.com" "inactive@test.com" "other@test.com" "loginTest@test.com" "orgOwner@test.com" "noPermissions@test.com" "another@test.com" "bncust@test.com" "bnuser@test.com" "broker@test.com" "xpress@test.com" "xpress2@test.com" "hanseatic@test.com" "mx@test.com" "costamare@test.com" "costamare2@test.com" "costamare3@test.com" "maersk@test.com" "maersk2@test.com" "maersk3@test.com" "danaos@test.com" "danaos2@test.com" "danaos3@test.com" "pil@test.com" "pil2@test.com" "pil3@test.com" "lomar@test.com" "lomar2@test.com" "hapag@test.com" "hapag2@test.com")

for i in "${emails[@]}"
do
   eval "node -e 'console.log(\"$i\", require(\"./utils/cryptoUtils.js\").encryptStringDeterministic(\"$i\"))'"
done
