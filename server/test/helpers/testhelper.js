'use strict'

const Hapi = require('hapi')
const jwtPlugin = require('hapi-auth-jwt2')
const authPlugin = require('../../auth-plugin')
const apiPlugin = require('../../api')
const nes = require('nes')
const Sequelize = require('sequelize')
const sequelizeConfig = require('../../config/sequelizeConfig')

sequelizeConfig.logging = false // set this to true if you need to debug the generated SQL queries

module.exports.startServer = async () => {
  const hapiSequelizePlugin = {
    plugin: require('hapi-sequelizejs'),
    options: {
      name: sequelizeConfig.database,
      models: ['server/api/models/**/*.js'],
      sequelize: new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig),
      sync: false,
      forceSync: false
    }
  }

  const plugins = [jwtPlugin, hapiSequelizePlugin, authPlugin, apiPlugin, nes]

  const server = new Hapi.Server({})
  // server.connection({ port: 8001 })
  await server.register(plugins)

  await server.initialize()

  server.ext('onPreResponse', (request, h) => {
    if (request.response.isBoom) {
      const err = request.response
      const errName = err.output.payload.error
      const errMessage = err.message || err.output.payload.message
      const statusCode = err.output.statusCode

      console.log([statusCode, errName, errMessage].join(' : '))
    }
    return h.continue
  })

  return server
}
