'use strict'

const Helper = require('./../helpers/testhelper')
const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const sinon = require('sinon')
const lab = (exports.lab = Lab.script())

const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

const twoFAUtils = require('../../utils/twoFAUtils')
const constants = require('./../helpers/constants')

describe('Testing API: users handler', () => {
  let server, newUserId, newUserActivationCode

  before(() => {
    return Helper.startServer().then((startedServer) => {
      server = startedServer
    })
  })

  it('should find a single user account', async () => {
    const options = {
      method: 'GET',
      url: '/user/' + constants.standardUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.firstName).to.equal('Test')
    expect(payload.lastName).to.equal('User')
    expect(payload.password).to.equal(null)
    expect(payload.hasOwnProperty('twoFactorSecret')).to.equal(false)
  })

  it('should not find a single user account for people without permissions', async () => {
    const options = {
      method: 'GET',
      url: '/user/' + constants.standardUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.otherUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should list all user accounts', async () => {
    const options = {
      method: 'GET',
      url: '/users',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.length > 0).to.equal(true)
    expect(
      payload.find((user) => user.userId === constants.otherUserId).firstName
    ).to.equal('Other')
  })

  it('should not list all user accounts for non-admins', async () => {
    const options = {
      method: 'GET',
      url: '/users',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.otherUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should register a user', async () => {
    const options = {
      method: 'POST',
      url: '/register',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
      payload: {
        email: 'new@test.com',
        password: 'letmein',
        isAdmin: false,
        firstName: 'Joe',
        lastName: 'Bloggs',
        nationality: 'UK',
        country: 'SG',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    newUserId = payload.userId
    newUserActivationCode = payload.activationCode

    delete payload.createdAt
    delete payload.updatedAt

    expect(response.statusCode).to.equal(200)
    expect(payload).to.equal({
      personaliseThirdPartyAds: true,
      privacyPolicyAgreedVersion: null,
      privacyPolicyAgreedVersionHistory: [],
      receiveCodeMinistryUpdateEmails: true,
      receiveThirdPartyOffers: true,
      termsOfUseAgreedVersion: null,
      termsOfUseAgreedVersionHistory: [],
      twoFactorEnabled: false,
      twoFactorLogin: false,
      userId: newUserId,
      email: 'new@test.com',
      password: null,
      activated: false,
      activationCode: newUserActivationCode,
      disabled: false,
      isAdmin: false,
      firstName: 'Joe',
      lastName: 'Bloggs',
      nationality: 'UK',
      country: 'SG',
      businessAddressLine1: null,
      businessAddressLine2: null,
      businessCity: null,
      businessPostalCode: null,
      businessState: null,
      company: null,
      dob: null,
      facebook: null,
      gender: null,
      industry: null,
      instagram: null,
      jobTitle: null,
      linkedin: null,
      personalIdNumber: null,
      phone: null,
      profileImage: null,
      residentialAddressLine1: null,
      residentialAddressLine2: null,
      residentialCity: null,
      residentialPostalCode: null,
      residentialState: null,
    })
  })

  it('should not allow non-admins to create admin users', async () => {
    const options = {
      method: 'POST',
      url: '/register',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        email: 'new2@test.com',
        password: 'letmein',
        isAdmin: true,
        firstName: 'Admin',
        lastName: 'Man',
        nationality: 'UK',
        country: 'SG',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should update a user', async () => {
    const options = {
      method: 'PUT',
      url: '/user/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
      payload: {
        userId: 'wibble', // will be ignored - just making sure the extra property doesn't cause a 400
        password: 'letmein', // will be ignored - just making sure the extra property doesn't cause a 400
        activated: true, // will be ignored - just making sure the extra property doesn't cause a 400
        disabled: true, // will be ignored - just making sure the extra property doesn't cause a 400
        isAdmin: true, // will be ignored - just making sure the extra property doesn't cause a 400
        email: 'edited@test.com',
        firstName: 'Adminny',
        lastName: 'Manny',
        gender: 'M',
        dob: '1978-03-28',
        nationality: 'SG',
        country: 'UK',
        phone: '+65 654321',
        linkedin: 'https://linkedin.com/jim',
        facebook: 'https://facebook.com/jim',
        instagram: 'https://instagram.com/jim',
        personalIdNumber: '12345',
        residentialAddressLine1: '46 Blair Rd',
        residentialAddressLine2: 'Tiong Bahru',
        residentialCity: 'Singapore',
        residentialState: 'Singapore',
        residentialPostalCode: '213645',
        profileImage: 'jim.png',
        company: 'CodeMinistry',
        industry: 'Doers!',
        jobTitle: 'Doer',
        businessAddressLine1: '46 Blair Rd',
        businessAddressLine2: 'Tiong Bahru',
        businessCity: 'Singapore',
        businessState: 'Singapore',
        businessPostalCode: '213645',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    delete payload.createdAt
    delete payload.updatedAt

    expect(response.statusCode).to.equal(200)
    expect(payload).to.equal({
      userId: newUserId,
      activated: false,
      activationCode: newUserActivationCode,
      businessAddressLine1: '46 Blair Rd',
      businessAddressLine2: 'Tiong Bahru',
      businessCity: 'Singapore',
      businessPostalCode: '213645',
      businessState: 'Singapore',
      company: 'CodeMinistry',
      country: 'UK',
      disabled: false,
      dob: '1978-03-28',
      email: 'edited@test.com',
      facebook: 'https://facebook.com/jim',
      firstName: 'Adminny',
      gender: 'M',
      industry: 'Doers!',
      instagram: 'https://instagram.com/jim',
      isAdmin: false,
      jobTitle: 'Doer',
      lastName: 'Manny',
      linkedin: 'https://linkedin.com/jim',
      nationality: 'SG',
      password: null,
      personalIdNumber: '12345',
      personaliseThirdPartyAds: true,
      phone: '+65 654321',
      privacyPolicyAgreedVersion: null,
      privacyPolicyAgreedVersionHistory: [],
      profileImage: 'jim.png',
      receiveCodeMinistryUpdateEmails: true,
      receiveThirdPartyOffers: true,
      residentialAddressLine1: '46 Blair Rd',
      residentialAddressLine2: 'Tiong Bahru',
      residentialCity: 'Singapore',
      residentialPostalCode: '213645',
      residentialState: 'Singapore',
      termsOfUseAgreedVersion: null,
      termsOfUseAgreedVersionHistory: [],
      twoFactorEnabled: false,
      twoFactorLogin: false,
    })
  })

  it("should change a user's password", async () => {
    const options = {
      method: 'PUT',
      url: '/user/password/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
      payload: {
        password: 'letmeinbro',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('Password changed')
  })

  it("should not change a user's password for someone without permission", async () => {
    const options = {
      method: 'PUT',
      url: '/user/password/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        password: 'letmeinbro',
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it("should enable a user's account", async () => {
    const options = {
      method: 'PUT',
      url: '/user/enable/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('User account enabled')
  })

  it("should not enable a user's account for someone without permission", async () => {
    const options = {
      method: 'PUT',
      url: '/user/enable/' + newUserId,
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

  it("should disable a user's account", async () => {
    const options = {
      method: 'PUT',
      url: '/user/disable/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('User account disabled')
  })

  it("should not disable a user's account for someone without permission", async () => {
    const options = {
      method: 'PUT',
      url: '/user/disable/' + newUserId,
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

  it("should activate a user's account", async () => {
    const options = {
      method: 'PUT',
      url: '/user/activate/' + newUserId + '/' + newUserActivationCode,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('User activated')
  })

  it("should not activate a user's account that is already activated", async () => {
    const options = {
      method: 'PUT',
      url: '/user/activate/' + newUserId + '/' + newUserActivationCode,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(400)
    expect(payload.message).to.equal('User already activated')
  })

  it('should not delete a user for someone without permission', async () => {
    const options = {
      method: 'DELETE',
      url: '/user/' + newUserId,
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

  it('should delete a user', async () => {
    const options = {
      method: 'DELETE',
      url: '/user/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('User deleted')
  })

  it('should not enable 2fa without a valid token', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/enable',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        secret: 'A super secret string',
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(false)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Invalid token')
    twoFAUtilsStub.restore()
  })

  it('should enable 2fa', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/enable',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        secret: 'A super secret string',
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('2FA enabled')
    expect(payload.secret).to.equal('A super secret string')
    twoFAUtilsStub.restore()
  })

  it('should not enable 2fa when it is already enabled', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/enable',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        secret: 'A super secret string',
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(400)
    expect(payload.message).to.equal('2FA already enabled')
    twoFAUtilsStub.restore()
  })

  it('should not disable 2fa without a valid token', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/disable',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(false)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Invalid token')
    twoFAUtilsStub.restore()
  })

  it('should disable 2fa', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/disable',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('2FA disabled')
    twoFAUtilsStub.restore()
  })

  it('should not disable 2fa when it is already disabled', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/disable',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(400)
    expect(payload.message).to.equal('2FA already disabled')
    twoFAUtilsStub.restore()
  })

  it('should not enable 2fa login without a valid token', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/enableLogin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(false)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Invalid token')
    twoFAUtilsStub.restore()
  })

  it('should enable 2fa login', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/enableLogin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('2FA login enabled')
    twoFAUtilsStub.restore()
  })

  it('should not enable 2fa login when it is already enabled', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/enableLogin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(400)
    expect(payload.message).to.equal('2FA login already enabled')
    twoFAUtilsStub.restore()
  })

  it('should not disable 2fa login without a valid token', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/disableLogin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(false)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Invalid token')
    twoFAUtilsStub.restore()
  })

  it('should disable 2fa login', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/disableLogin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('2FA login disabled')
    twoFAUtilsStub.restore()
  })

  it('should not disable 2fa login when it is already disabled', async () => {
    const options = {
      method: 'PUT',
      url: '/user/2fa/disableLogin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(400)
    expect(payload.message).to.equal('2FA login already disabled')
    twoFAUtilsStub.restore()
  })

  it('should not verify an invalid 2fa token', async () => {
    const options = {
      method: 'POST',
      url: '/user/2fa/verify',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(false)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Invalid token')
    twoFAUtilsStub.restore()
  })

  it('should verify a valid 2fa token', async () => {
    const options = {
      method: 'POST',
      url: '/user/2fa/verify',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        token: 123456,
      },
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('Valid token')
    twoFAUtilsStub.restore()
  })

  it("should update a user's privacy preferences", async () => {
    const options = {
      method: 'PUT',
      url: '/user/privacy',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
      payload: {
        personaliseThirdPartyAds: false,
        receiveThirdPartyOffers: false,
        receiveCodeMinistryUpdateEmails: false,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('User privacy settings updated')
  })

  it('should not allow a user to approve an outdated privacy policy', async () => {
    const options = {
      method: 'PUT',
      url: '/user/privacyPolicy/1/agree',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(400)
    expect(payload.message).to.equal('1 is not the latest version')

    const checkOptions = {
      method: 'GET',
      url: `/user/${constants.standardUserId}`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const checkResponse = await server.inject(checkOptions)
    const checkPayload = JSON.parse(checkResponse.payload)

    expect(checkPayload.privacyPolicyAgreedVersion).to.equal(null)
  })

  it('should allow a user to approve the privacy policy', async () => {
    const options = {
      method: 'PUT',
      url: '/user/privacyPolicy/3/agree',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('Privacy policy version 3 agreed')

    const checkOptions = {
      method: 'GET',
      url: `/user/${constants.standardUserId}`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const checkResponse = await server.inject(checkOptions)
    const checkPayload = JSON.parse(checkResponse.payload)

    expect(checkPayload.privacyPolicyAgreedVersion).to.equal(3)
    expect(checkPayload.privacyPolicyAgreedVersionHistory.length).to.equal(1)
    expect(
      checkPayload.privacyPolicyAgreedVersionHistory[0].privacyPolicyId
    ).to.equal(3)
  })

  it('should not allow a user to approve an outdated terms of use', async () => {
    const options = {
      method: 'PUT',
      url: '/user/termsOfUse/1/agree',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(400)
    expect(payload.message).to.equal('1 is not the latest version')

    const checkOptions = {
      method: 'GET',
      url: `/user/${constants.standardUserId}`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const checkResponse = await server.inject(checkOptions)
    const checkPayload = JSON.parse(checkResponse.payload)

    expect(checkPayload.termsOfUseAgreedVersion).to.equal(null)
    expect(checkPayload.termsOfUseAgreedVersionHistory).to.equal([])
  })

  it('should allow a user to approve the terms of use', async () => {
    const options = {
      method: 'PUT',
      url: '/user/termsOfUse/3/agree',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.standardUserToken,
      },
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('Terms of use version 3 agreed')

    const checkOptions = {
      method: 'GET',
      url: `/user/${constants.standardUserId}`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: constants.adminUserToken,
      },
    }
    const checkResponse = await server.inject(checkOptions)
    const checkPayload = JSON.parse(checkResponse.payload)

    expect(checkPayload.termsOfUseAgreedVersion).to.equal(3)
    expect(checkPayload.termsOfUseAgreedVersionHistory.length).to.equal(1)
    expect(
      checkPayload.termsOfUseAgreedVersionHistory[0].termsOfUseId
    ).to.equal(3)
  })
})
