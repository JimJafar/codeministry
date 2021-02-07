'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const Helper = require('./../helpers/testhelper')
const lab = (exports.lab = Lab.script())

const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

describe('Testing API: time handler', () => {
  let server

  before(() => {
    return Helper.startServer().then((startedServer) => {
      server = startedServer
    })
  })

  it('should get the time', async () => {
    const options = {
      method: 'GET',
      url: '/time',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.hasOwnProperty('utc')).to.equal(true)
    expect(payload.hasOwnProperty('iso')).to.equal(true)
    expect(payload.hasOwnProperty('timestamp')).to.equal(true)
  })
})
