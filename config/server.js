'use strict'
const Op = require('sequelize').Op

const configuration = {
  development: {
    database: {}
  },
  localtest: {
    database: {}
  },
  // These should match environment variables on hosted server
  testserver: {
    database: {
      pool: {
        // @TODO: review this! It's for replication read pool - these are the default Sequelize settings
        maxConnections: 10,
        minConnections: 0,
        maxIdleTime: 1000
      }
    }
  },
  // These should match environment variables on hosted server
  production: {
    database: {
      pool: {
        // @TODO: review this! It's for replication read pool - these are the default Sequelize settings
        maxConnections: 10,
        minConnections: 0,
        maxIdleTime: 1000
      }
    }
  }
}

console.info(`Configuring for ${process.env.NODE_ENV}`)

if (!configuration.hasOwnProperty(process.env.NODE_ENV)) {
  console.error(new Error(`Unrecognised environment ${process.env.NODE_ENV}. Did you forget to set the NODE_ENV variable?`))
}

const conf = configuration[process.env.NODE_ENV]

conf.environment = process.env.NODE_ENV
conf.axiosBaseUrl = process.env._AXIOS_BASE_URL_
conf.encryptionKey = process.env.ENCRYPTION_KEY
conf.jwtSecret = process.env.JWT_SECRET
conf.hapiHost = process.env.HAPI_HOST
conf.hapiPort = process.env.HAPI_PORT
conf.mailgunKey = process.env.MAILGUN_KEY
conf.mailgunDomain = process.env.MAILGUN_DOMAIN
conf.maxBytes = 10485760 // 10MB

conf.database.host = process.env.DB_HOST
conf.database.port = process.env.DB_PORT
conf.database.username = process.env.DB_USER
conf.database.password = process.env.DB_PASS
conf.database.database = process.env.DB_NAME
conf.database.logging = process.env.DB_LOGGING === 'TRUE'
conf.database.dialect = 'postgres'
conf.database.operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
}

module.exports = conf
