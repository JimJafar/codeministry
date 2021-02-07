require('require-sql')
const pg = require('pg')
const dropTables = require('./drop_tables.sql')
const sessions = require('./creation-scripts/sessions.sql')
const logs = require('./creation-scripts/logs.sql')
const privacyPolicies = require('./creation-scripts/privacy_policies.sql')
const termsOfUse = require('./creation-scripts/terms_of_use.sql')
const users = require('./creation-scripts/users.sql')

const testdataUsers = require('./testdata/testdata_users.sql')
const testdataUnitTestUsers = require('./testdata/testdata_unit_test_users.sql')
const testdataSessions = require('./testdata/testdata_sessions.sql')
const testdataPrivacyPolicies = require('./testdata/testdata_privacy_policies.sql')
const testdataTermsOfUse = require('./testdata/testdata_terms_of_use.sql')

// patches
const patches = []
// @TODO: After initial launch bake the launchdb and move to patches
// console.log('Adding patches: ')
// require('fs').readdirSync('./patches').forEach(function(patch) {
//   console.log(patch)
//   patches.push(require(`./patches/${patch}`))
// })

const env = process.env.NODE_ENV || 'development'

const getConfig = () => {
  return {
    development: {
      user: 'cm_site_user',
      database: 'codeministry_site',
      password: 'cm$awesome!',
      host: 'localhost',
      port: 5432,
    },
    localtest: {
      user: 'cm_site_user',
      database: 'codeministry_site_test',
      password: 'cm$awesome!',
      host: 'localhost',
      port: 5432,
    },
    // ,
    // test: {
    //   user: 'cm_site_user',
    //   database: 'codeministry_site_test',
    //   password: '????',
    //   host: '????.ap-southeast-1.rds.amazonaws.com',
    //   port: 5442
    // }
  }[env]
}

const queryList = [
  // drop tables
  dropTables,
  // create tables
  privacyPolicies,
  termsOfUse,
  users,
  sessions,
  logs,
  // patches
  patches.join('\n'),
]

switch (env) {
  case 'development':
  case 'test':
    queryList.push(testdataUsers)
    break
  case 'localtest':
    queryList.push(
      // also in dev & test
      testdataUsers,
      // only in localtest
      testdataPrivacyPolicies,
      testdataTermsOfUse,
      testdataUnitTestUsers,
      testdataSessions
    )
    break
}

const doQuery = (query) => {
  return new Promise((resolve, reject) => {
    const client = new pg.Client(getConfig())
    client.connect(function (err) {
      if (err) return reject(err)

      client.query(query, function (err, result) {
        client.end(function (err) {
          if (err) return reject(err)
        })

        if (err) {
          return reject(err)
        } else {
          return resolve()
        }
      })
    })
  })
}

const doQueries = async () => {
  console.log(`RESETTING ${env} DB`)
  for (const query of queryList) {
    try {
      await doQuery(query)
    } catch (e) {
      console.log('FAILED TO RUN QUERY: ', query.substr(0, 1000))
      throw e
    }
  }
}

doQueries()
