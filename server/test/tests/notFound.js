'use strict'

const Helper = require('./../helpers/testhelper')
const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

describe('Testing API: notFound', () => {
  let server

  before((done) => {
    return Helper.startServer()
      .then(startedServer => {
        server = startedServer
      })
  })

  it('Unknown route should return http status 404', async () => {
    const response = await server.inject('/unkownroute')
    expect(response.statusCode).to.equal(404)
  })
})
