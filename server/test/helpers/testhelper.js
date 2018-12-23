'use strict'

process.env['PRISMIC_API_URL'] = 'https://codeministry.prismic.io/api/v2'
process.env['HAPI_HOST'] = '127.0.0.1'
process.env['HAPI_PORT'] = 8000
process.env['_AXIOS_BASE_URL_'] = 'http://localhost:8000'
process.env['DB_HOST'] = 'localhost'
process.env['DB_PORT'] = 5432
process.env['DB_USER'] = 'cm_site_user'
process.env['DB_PASS'] = 'cm$awesome!'
process.env['DB_NAME'] = 'codeministry_site_test'
process.env['ENCRYPTION_KEY'] = 'tW0LKP5lg2VHVYmMLtLPNcX6DXMjXvvE'
process.env['JWT_SECRET'] = 'Qfs7mHpMuNoUNrYIipnB8GcWiCq11iHiw4mQgzOln8ZEEP73r5HbATElIgzLz26wfzlHIg5qM6TG0QDl2l4IC1wI8Yi78/oCYCL+0VN0AWhUik+pt78WkrL2kZrHCNNNb1WY9XDD+D9AAGvtMDZ5OTGflWhNo9259glzKSMJwqkQZQveGeIfgKnT5yi6rF1C68/pmALNbtMua21w4uUDfozRYYqfrl3lC66UvYfbptqgkrrSMHYqllLIYuVYlByT7qOZi9Q3IB86CnPo6R/Bv2CQ2kGQm+1ASDrc3Cqyq37TRLoTCuWQCfTbY2JqrIRH9t4JOEXkiChiH51cF8fdmw=='
process.env['DB_LOGGING'] = 'FALSE'

const Hapi = require('hapi')
const jwtPlugin = require('hapi-auth-jwt2')
const authPlugin = require('../../auth-plugin')
const apiPlugin = require('../../api')
const nes = require('nes')
const Sequelize = require('sequelize')
const config = require('../../../config/server')

config.database.logging = false // set this to true if you need to debug the generated SQL queries

module.exports.startServer = async () => {
  const hapiSequelizePlugin = {
    plugin: require('hapi-sequelizejs'),
    options: {
      name: config.database.database,
      models: ['server/api/models/**/*.js'],
      sequelize: new Sequelize(config.database.database, config.database.username, config.database.password, config.database),
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
