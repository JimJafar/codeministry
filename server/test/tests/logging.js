'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const Helper = require('./../helpers/testhelper')
const constants = require('./../helpers/constants')

const lab = (exports.lab = Lab.script())

const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

describe('Testing API: logging handler', () => {
  let server, createdLogId

  before(() => {
    return Helper.startServer().then((startedServer) => {
      server = startedServer
    })
  })

  it('should create logs', async () => {
    const options = {
      method: 'POST',
      url: '/log',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        description: 'Error in some module',
        message: 'Something bad happened',
        code: 'ABC123',
        type: 3,
        identifier: null,
        callstack: ['SomeMethod', 'SomeOtherMethod'],
        deviceInfo: {
          browser: 'Internet Exploder',
          os: 'Windoze',
          device: 'Desktop',
          userAgent: 'Whatevs',
          os_version: '10',
        },
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('Log created')
    createdLogId = 1 // Assumes there is no test data for logs
  })

  it('should find a log', async () => {
    const options = {
      method: 'GET',
      url: '/log/' + createdLogId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.logId).to.equal(1)
    expect(payload.identifier).to.equal(constants.standardUserId)
    expect(payload.callstack).to.equal(['SomeMethod', 'SomeOtherMethod'])
    expect(payload.deviceInfo).to.equal({
      browser: 'Internet Exploder',
      os: 'Windoze',
      device: 'Desktop',
      userAgent: 'Whatevs',
      os_version: '10',
    })
  })

  it('should not allow non-admins to find a log', async () => {
    const options = {
      method: 'GET',
      url: '/log/' + createdLogId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should list all logs', async () => {
    const options = {
      method: 'GET',
      url: '/logs',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)

    if (payload.length > 1) {
      console.log(JSON.stringify(payload, null, '\t'))
    }

    expect(payload.length).to.equal(1)
  })

  it('should not allow non-admins list logs', async () => {
    const options = {
      method: 'GET',
      url: '/logs',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should delete all logs', async () => {
    const options = {
      method: 'DELETE',
      url: '/logs',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('0 log(s) deleted')
  })

  it('should not allow non-admins to delete all logs', async () => {
    const options = {
      method: 'DELETE',
      url: '/logs',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should block abusive logging', async () => {
    const options = {
      method: 'POST',
      url: '/log',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: null,
      },
      payload: {
        description: 'Attempted DOS',
        message: 'Attempted DOS',
        code: 'ABC123',
        type: 3,
        identifier: null,
        callstack: null,
        deviceInfo: null,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('Log created')

    for (let i = 0; i <= 8; i++) {
      await server.inject(options)
    }

    const checkResponse = await server.inject(options)
    const checkPayload = JSON.parse(checkResponse.payload)
    expect(checkResponse.statusCode).to.equal(429)
    expect(checkPayload.message).to.equal('Too many requests')
  })
})
