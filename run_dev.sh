#!/usr/bin/env bash

cross-env \
NODE_ENV="development" \
MAILGUN_KEY="" \
MAILGUN_DOMAIN="" \
DO_API_ADDRESS="http://localhost:3000/api/" \
HAPI_HOST="127.0.0.1" \
HAPI_PORT=3000 \
_AXIOS_BASE_URL_="http://localhost:8000" \
DB_HOST="localhost" \
DB_PORT=5432 \
DB_USER="cm_site_user" \
DB_PASS="cm\$awesome!" \
DB_NAME="codeministry_site" \
ENCRYPTION_KEY="5Y5wb0oNmsWOWyWozKYqj7CyWR3Kvb29" \
JWT_SECRET="mByk6pq7OnsZyvhdFpFvRE7ngQDtRvp3TOUnNs/yfG9yaQryEcl6JQQEirWuUCT1KjMKQRO2cHsKzbaO218EfEpzKLLr6yedV9MOkuK0zSwSv9QW61BmbjKPaNfDCr1IGIUA/BvtEVpUe4Sn31Cb5mh1StL7R+rpuqTHdPJTku2BSVErV9QT/ujC9NYaI76k5n1pL32gQ6ieB6KEMuJOsM4OU57T83gTJhq34wJBeQYZxng6wpCpjwJEL1Lkebmq0f5ea2kqmxUUaIwiZBL2Ujb1ngNnKVVT2OLNbj/jPZcKlYlR6Vc16xvCIIB+OCRkfqSjNhhmjXR6JJ6fen7rmA==" \
DB_LOGGING="FALSE" \
nodemon server/index.js --watch server
