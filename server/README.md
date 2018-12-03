# codeministry.com backend

## Testing via Swagger
[http://localhost:3000/documentation](http://localhost:3000/documentation) 

## Node version
8.11.1

## Required global node modules:
```

```

## Core Stack

- **Node.js** - [http://nodejs.org/](http://nodejs.org/)
- **Hapi** - [http://hapijs.com/](http://hapijs.com/)

## Quick Start

Clone project and install dependencies:
```bash
npm install
```

Run tests:
```bash
source npm test
```

Run tests on just one file:
```bash
source npm test -- contracts
```

Update a dependency:
```bash
npm outdated
npm update package-name
npm shrinkwrap
```

Update ALL dependencies (BE CAREFUL!!!)
```bash
npm install -g npm-check-updates
npm-check-updates -u
npm install
npm shrinkwrap
# AND NOW TEST VERY VERY VERY THOROUGHLY!
```

## Plugins

- **hapi-auth-jwt2** - Secure Hapi.js authentication plugin using JSON Web Tokens (JWT) in Headers, Query or Cookies.
https://github.com/dwyl/hapi-auth-jwt2
- **lab** - Node test utility.
https://github.com/hapijs/lab

## Project Structure
```
.
├── api/
|   ├── handlers/
|   |   └── *.js      * Handlers
|   └── index.js      * REST routes
├── test/
|   └── *.js          * API tests
├── server.js         * Server definition (uses the Glue plugin to read a manifest)
├── auth-plugin.js    * Auth strategies
└── package.json
```

## Postgres

Make sure you are using 10.3 - this is the version running in AWS!

**Initial setup**

Run this against your local PSQL instance:

    CREATE USER cm_site_user WITH PASSWORD 'cm$awesome!';
    CREATE DATABASE codeministry_site;
    CREATE DATABASE codeministry_site_test;
    ALTER DATABASE codeministry_site OWNER TO cm_site_user;
    ALTER DATABASE codeministry_site_test OWNER TO cm_site_user;

Then run this to set up your local development DB:

    npm run resetdb

**Best practices**

Always use `character varying`:

> Tip: There is no performance difference among these three types, apart from increased storage space when using the blank-padded type, and a few extra CPU cycles to check the length when storing into a length-constrained column. While character(n) has performance advantages in some other database systems, there is no such advantage in PostgreSQL; in fact character(n) is usually the slowest of the three because of its additional storage costs. In most situations text or character varying should be used instead.

## Sequelize

**NOTE: Every table must have the following columns to satisfy Sequelize:**

    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ

You will also need to add the following lines to your generated models:

    createdAt: 'created_at',
    updatedAt: 'updated_at'

These lines should be added in the options object that is passed as the 3rd argument to sequelize.define() after the definition.
Like this:

    module.exports = function(sequelize, DataTypes) {
      return sequelize.define('contracts', {
        // ...
      }, {
        tableName: 'contracts',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      });
    };

Fuzzy searching (SLOW - DO NOT USE IN CODE!):
[]https://www.rdegges.com/2013/easy-fuzzy-text-searching-with-postgresql/](https://www.rdegges.com/2013/easy-fuzzy-text-searching-with-postgresql/)

## CI/CD


## Wiki


## Backlog / issue tracking: 


## Test data

**users**

Password for all is `password`

- `admin@test.com` Admin user
- `user@test.com` Standard user

## NOTES:

## Encrypt stuff from the commandline:

    node -e 'console.log(require("./utils/cryptoUtils").encryptString("text"))'

## Hash stuff from the commandline:

    node -e "require('bcryptjs').hash('password', 10, (err, hash) => console.log(hash, err))"

## Test email sending from the commandline:

    NODE_ENV=test node -e "require('./utils/emailUtils').sendEmail(['jim@sangwine.net'], 'test', 'Testing!', 'Testing!')"

## @TODO:


## IMPORTANT

