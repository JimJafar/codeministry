const Pack = require('../package')
const Hapi = require('hapi')
const consola = require('consola')
const HapiNuxt = require('hapi-nuxt')
const Sequelize = require('sequelize')
const path = require('path')
const sequelizeConfig = require('./config/sequelizeConfig')

async function start () {
  const server = new Hapi.Server({
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000
  })

  await server.register([
    { plugin: HapiNuxt },
    { plugin: require('hapi-auth-jwt2') },
    { plugin: require('nes') },
    { plugin: require('./auth-plugin') },
    {
      plugin: require('./api'),
      options: {
        routes: {
          prefix: '/api'
        }
      }
    },
    { plugin: require('inert') }, // required by hapi-sequelizejs
    { plugin: require('vision') }, // required by hapi-sequelizejs
    {
      plugin: require('hapi-sequelizejs'),
      options: [
        {
          name: 'dbname', // identifier
          models: [path.join(__dirname, '/api/models/**/*.js')], // paths/globs to model files
          sequelize: new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig), // sequelize instance
          sync: true, // sync models - default false
          forceSync: false // force sync (drops tables) - default false
        }
      ]
    }
  ])

  // only add Swagger documentation in DEV
  if (!process.env.PRODUCTION) {
    await server.register([
      {
        plugin: require('hapi-swagger'),
        options: {
          info: {
            'title': 'Test API Documentation',
            'version': Pack.version
          }
        }
      }
    ])
  }

  await server.start()

  consola.ready({
    message: `Server running at: ${server.info.uri}`,
    badge: true
  })

  consola.info({
    message: `Swagger API documentation available at: ${server.info.uri}/documentation`,
    badge: true
  })
}

start().catch(consola.error)
