'use strict'

const configuration = {
  development: {
    apiAddress: 'http://localhost:3000/api/'
  },
  test: {
    apiAddress: 'https://testapi.doerscircle.com/api/'
  },
  production: {
    apiAddress: 'https://api.doerscircle.com/api/'
  }
}

console.info(`Configuring for ${process.env.environment}`)

if (!configuration.hasOwnProperty(process.env.environment)) {
  console.error(new Error(`Unrecognised environment ${process.env.environment}. Did you forget to set the ENVIRONMENT variable?`))
}

export default configuration[process.env.environment]
