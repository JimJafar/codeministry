const Pack = require('../package')
const Hapi = require('hapi')
const consola = require('consola')
const HapiNuxt = require('hapi-nuxt')
const Sequelize = require('sequelize')
const path = require('path')
const logUtil = require('./utils/logUtil')
const config = require('../config/server')

async function start () {
  const failActionHandler = async (request, h, err) => {
    consola.error(err)
    if (err.isBoom && err.output.payload.statusCode !== 401) {
      const errName = err.output.payload.error
      const errMessage = err.message || err.output.payload.message
      const statusCode = err.output.payload.statusCode
      const error = new Error(errMessage)
      // error.stack = {
      //   path: request.path,
      //   query: request.query,
      //   params: request.params,
      //   method: request.method,
      //   ip: request.info.remoteAddress,
      //   originalError: err.original
      // }

      logUtil.error(request, [request.url.href, statusCode, errName].join(': '), error)
    }

    if (err.name === 'ValidationError' && config.environment !== 'development') {
      err.message = err.output.payload.message = 'Invalid request payload input'
    }
    throw err
  }

  const server = new Hapi.Server({
    host: config.hapiHost,
    port: config.hapiPort,
    routes: {
      cors: true,
      payload: {
        maxBytes: config.maxBytes,
        failAction: failActionHandler
      },
      response: {
        failAction: failActionHandler
      },
      state: {
        failAction: failActionHandler
      },
      validate: {
        options: {
          allowUnknown: true
        },
        failAction: failActionHandler
      }
    }
  })

  await server.register([
    { plugin: HapiNuxt },
    { plugin: require('hapi-auth-jwt2') },
    { plugin: require('nes') },
    { plugin: require('./auth-plugin') },
    { plugin: require('./api'), routes: { prefix: '/api' } },
    { plugin: require('inert') }, // required by hapi-sequelizejs
    { plugin: require('vision') }, // required by hapi-sequelizejs
    {
      plugin: require('hapi-sequelizejs'),
      options: [
        {
          name: config.database.database, // identifier
          models: [path.join(__dirname, '/api/models/**/*.js')], // paths/globs to model files
          sequelize: new Sequelize(config.database.database, config.database.username, config.database.password, config.database), // sequelize instance
          sync: true, // sync models - default false
          forceSync: false // force sync (drops tables) - default false
        }
      ]
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    if (request.response.isBoom) {
      const err = request.response
      // const errName = err.output.payload.error
      // const errMessage = err.message || err.output.payload.message
      // const statusCode = err.output.statusCode

      // console.log([statusCode, errName, errMessage].join(' : '))
      failActionHandler(request, h, err)
    }
    return h.continue
  })

  // only add Swagger documentation in DEV
  if (config.environment === 'development') {
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
