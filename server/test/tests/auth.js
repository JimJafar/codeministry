'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const Helper = require('./../helpers/testhelper')
const lab = (exports.lab = Lab.script())

const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

describe('Testing API: auth handler', () => {
  let server
  let token

  before(() => {
    return Helper.startServer().then((startedServer) => {
      server = startedServer
    })
  })

  it('should login', async () => {
    const options = {
      method: 'POST',
      url: '/login',
      payload: {
        email: 'loginTest@test.com',
        password: 'password',
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.user.email).to.equal('loginTest@test.com')
    expect(payload.user.mustAgreeToPrivacyPolicy).to.equal(true)
    expect(payload.user.mustAgreeToTermsOfUse).to.equal(true)
    expect(payload.user.privacyPolicyAgreedVersion).to.equal(null)
    expect(payload.user.termsOfUseAgreedVersion).to.equal(null)
    token = payload.token
  })

  it('should not login with bad credentials', async () => {
    const options = {
      method: 'POST',
      url: '/login',
      payload: {
        email: 'loginTest@test.com',
        password: 'passwordx',
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(400)
    expect(payload.message).to.equal('Invalid credentials')
  })

  it('should not login inactive users', async () => {
    const options = {
      method: 'POST',
      url: '/login',
      payload: {
        email: 'inactive@test.com',
        password: 'password',
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Inactive')
  })

  it('should not login disabled users', async () => {
    const options = {
      method: 'POST',
      url: '/login',
      payload: {
        email: 'disabled@test.com',
        password: 'password',
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Disabled')
  })

  it('should logout', async () => {
    const options = {
      method: 'POST',
      url: '/logout',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: token,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('Logged out')
  })
})
