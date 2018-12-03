'use strict'
const Op = require('sequelize').Op
const env = process.env.NODE_ENV || 'development'

const configuration = {
  development: {
    host: 'localhost',
    port: 5432,
    username: 'cm_site_user',
    password: 'cm$awesome!',
    database: 'codeministry_site',
    dialect: 'postgres',
    logging: false
  },
  localtest: {
    host: 'localhost',
    port: 5432,
    username: 'cm_site_user',
    password: 'cm$awesome!',
    database: 'codeministry_site_test',
    dialect: 'postgres',
    logging: false
  },
  // These should match environment variables on hosted server
  testserver: {
    host: process.env.DB_TST_HOST,
    port: process.env.DB_TST_PORT,
    username: process.env.DB_TST_USER,
    password: process.env.DB_TST_PASS,
    database: 'codeministry_site_test',
    dialect: 'postgres',
    logging: false,
    pool: {
      // @TODO: review this! It's for replication read pool - these are the default Sequelize settings
      maxConnections: 10,
      minConnections: 0,
      maxIdleTime: 1000
    }
  },
  // These should match environment variables on hosted server
  production: {
    host: process.env.DB_PRD_HOST,
    port: process.env.DB_PRD_PORT,
    username: process.env.DB_PRD_USER,
    password: process.env.DB_PRD_PASS,
    database: 'codeministry_site_prod',
    dialect: 'postgres',
    logging: false,
    pool: {
      // @TODO: review this! It's for replication read pool - these are the default Sequelize settings
      maxConnections: 10,
      minConnections: 0,
      maxIdleTime: 1000
    }
  }
}

const config = configuration[env]

config.operatorsAliases = {
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

module.exports = config
