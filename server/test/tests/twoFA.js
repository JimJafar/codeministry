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

describe('Testing API: 2FA handler', () => {
  let server

  before(() => {
    return Helper.startServer().then((startedServer) => {
      server = startedServer
    })
  })

  it('should generate a 2fa secret and QRCode URL', async () => {
    const options = {
      method: 'GET',
      url: '/2fa/generateSecret',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(
      payload.hasOwnProperty('secret') && payload.secret.length > 0
    ).to.equal(true)
    expect(
      payload.hasOwnProperty('qrCodeUrl') && payload.secret.length > 0
    ).to.equal(true)
  })
})
