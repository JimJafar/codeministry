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

describe('Testing API: termsOfUse handler', () => {
  let server, createdTermsOfUseId

  before(() => {
    return Helper.startServer().then((startedServer) => {
      server = startedServer
    })
  })

  it('should not allow non-admins to add a terms of use', async () => {
    const options = {
      method: 'POST',
      url: '/termsOfUse',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        versionNotes: 'Test version',
        content: '<h1>Terms of use</h1>No cookies',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should add a terms of use', async () => {
    const options = {
      method: 'POST',
      url: '/termsOfUse',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
      payload: {
        versionNotes: 'Test version',
        content: '<h1>Terms of use</h1>No cookies',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.versionNotes).to.equal('Test version')
    expect(payload.content).to.equal('<h1>Terms of use</h1>No cookies')
    expect(payload.uploadedBy).to.equal(constants.adminUserId)

    createdTermsOfUseId = payload.termsOfUseId
  })

  it('should get the latest terms of use', async () => {
    const options = {
      method: 'GET',
      url: '/termsOfUse/latest',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.versionNotes).to.equal('Test version')
    expect(payload.content).to.equal('<h1>Terms of use</h1>No cookies')
    expect(payload.uploadedBy).to.equal(constants.adminUserId)
    expect(payload.termsOfUseId).to.equal(createdTermsOfUseId)
  })

  it('should not list all terms of use for non-admins', async () => {
    const options = {
      method: 'GET',
      url: '/termsOfUse/all',
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

  it('should list all terms of use', async () => {
    const options = {
      method: 'GET',
      url: '/termsOfUse/all',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.length).to.equal(3)
    expect(
      payload.map((pp) => pp.termsOfUseId).includes(createdTermsOfUseId)
    ).to.equal(true)
  })
})
