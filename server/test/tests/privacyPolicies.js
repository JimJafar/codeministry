'use strict'

const Helper = require('./../helpers/testhelper')
const constants = require('./../helpers/constants')

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

describe('Testing API: privacyPolicies handler', () => {
  let server, createdPrivacyPolicyId

  before(() => {
    return Helper.startServer()
      .then(startedServer => {
        server = startedServer
      })
  })

  it('should not allow non-admins to add a privacy policy', async () => {
    const options = {
      method: 'POST',
      url: '/privacyPolicies',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.standardUserToken
      },
      payload: {
        versionNotes: 'Test version',
        content: '<h1>Privacy Policy</h1>No cookies'
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should add a privacy policy', async () => {
    const options = {
      method: 'POST',
      url: '/privacyPolicies',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.adminUserToken
      },
      payload: {
        versionNotes: 'Test version',
        content: '<h1>Privacy Policy</h1>No cookies'
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.versionNotes).to.equal('Test version')
    expect(payload.content).to.equal('<h1>Privacy Policy</h1>No cookies')
    expect(payload.uploadedBy).to.equal(constants.adminUserId)

    createdPrivacyPolicyId = payload.privacyPolicyId
  })

  it('should get the latest privacy policy', async () => {
    const options = {
      method: 'GET',
      url: '/privacyPolicies/latest',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.standardUserToken
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.versionNotes).to.equal('Test version')
    expect(payload.content).to.equal('<h1>Privacy Policy</h1>No cookies')
    expect(payload.uploadedBy).to.equal(constants.adminUserId)
    expect(payload.privacyPolicyId).to.equal(createdPrivacyPolicyId)
  })

  it('should not list all privacy policies for non-admins', async () => {
    const options = {
      method: 'GET',
      url: '/privacyPolicies/all',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.standardUserToken
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should list all privacy policies', async () => {
    const options = {
      method: 'GET',
      url: '/privacyPolicies/all',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.adminUserToken
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.length).to.equal(3)
    expect(payload.map(pp => pp.privacyPolicyId).includes(createdPrivacyPolicyId)).to.equal(true)
  })
})
