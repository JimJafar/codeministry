#!/usr/bin/env bash

cross-env \
NODE_ENV="development" \
MAILGUN_KEY="pubkey-740753b7b94451a0dad07e4d4759baad" \
MAILGUN_DOMAIN="https://app.mailgun.com/app/domains/sandboxf06a4add6803462493ef91f3ef9605ff.mailgun.org" \
PRISMIC_API_URL="https://codeministry.prismic.io/api/v2" \
DO_API_ADDRESS="http://localhost:3000/api/" \
HAPI_HOST="127.0.0.1" \
HAPI_PORT=3000 \
_AXIOS_BASE_URL_="http://localhost:8000" \
DB_HOST="localhost" \
DB_PORT=5432 \
DB_USER="cm_site_user" \
DB_PASS="cm\$awesome!" \
DB_NAME="codeministry_site" \
ENCRYPTION_KEY="tW0LKP5lg2VHVYmMLtLPNcX6DXMjXvvE" \
JWT_SECRET="Qfs7mHpMuNoUNrYIipnB8GcWiCq11iHiw4mQgzOln8ZEEP73r5HbATElIgzLz26wfzlHIg5qM6TG0QDl2l4IC1wI8Yi78/oCYCL+0VN0AWhUik+pt78WkrL2kZrHCNNNb1WY9XDD+D9AAGvtMDZ5OTGflWhNo9259glzKSMJwqkQZQveGeIfgKnT5yi6rF1C68/pmALNbtMua21w4uUDfozRYYqfrl3lC66UvYfbptqgkrrSMHYqllLIYuVYlByT7qOZi9Q3IB86CnPo6R/Bv2CQ2kGQm+1ASDrc3Cqyq37TRLoTCuWQCfTbY2JqrIRH9t4JOEXkiChiH51cF8fdmw==" \
DB_LOGGING="FALSE" \
nodemon server/index.js --watch server
