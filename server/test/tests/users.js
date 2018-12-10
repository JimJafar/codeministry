'use strict'

const Helper = require('./../helpers/testhelper')
const constants = require('./../helpers/constants')

const Code = require('code')
const Lab = require('lab')
const sinon = require('sinon')
const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

const twoFAUtils = require('../../utils/twoFAUtils')

describe('Testing API: users handler', () => {
  let server, newUserId, newUserActivationCode

  before(() => {
    return Helper.startServer()
      .then(startedServer => {
        server = startedServer
      })
  })

  it('should find a single user account', async () => {
    const options = {
      method: 'GET',
      url: '/user/' + constants.standardUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.standardUserToken
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.name).to.equal('Test User')
    expect(payload.password).to.equal(null)
    expect(payload.hasOwnProperty('twoFactorSecret')).to.equal(false)
  })

  it('should not find a single user account for people without permissions', async () => {
    const options = {
      method: 'GET',
      url: '/user/' + constants.standardUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.otherUserToken
      }
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
        'Authorization': constants.adminUserToken
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.length > 0).to.equal(true)
    expect(payload.find(user => user.userId === constants.otherUserId).name).to.equal('Other Test User')
  })

  it('should not list all user accounts for non-admins', async () => {
    const options = {
      method: 'GET',
      url: '/users',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.otherUserToken
      }
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
        'Authorization': constants.adminUserToken
      },
      payload: {
        email: 'new@test.com',
        mobileNumber: '95841232',
        officeNumber: '63458998',
        password: 'letmein',
        activated: false,
        disabled: false,
        name: 'A new user',
        isAdmin: false
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    newUserId = payload.userId
    newUserActivationCode = payload.activationCode

    delete payload.createdAt
    delete payload.updatedAt

    expect(response.statusCode).to.equal(200)
    expect(payload).to.equal({
      userId: newUserId,
      email: 'new@test.com',
      mobileNumber: '95841232',
      officeNumber: '63458998',
      password: null,
      activated: false,
      activationCode: newUserActivationCode,
      disabled: false,
      name: 'A new user',
      isAdmin: false,
      twoFactorEnabled: false,
      twoFactorLogin: false,
      personaliseThirdPartyAds: true,
      receiveCodeMinistryUpdateEmails: true,
      receiveThirdPartyOffers: true,
      privacyPolicyAgreedVersion: null,
      termsOfUseAgreedVersion: null,
      privacyPolicyAgreedVersionHistory: [],
      termsOfUseAgreedVersionHistory: []
    })
  })

  it('should not allow non-admins to create admin users', async () => {
    const options = {
      method: 'POST',
      url: '/register',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.standardUserToken
      },
      payload: {
        email: 'new2@test.com',
        mobileNumber: '95841232',
        officeNumber: '63458998',
        password: 'letmein',
        activated: false,
        disabled: false,
        name: 'Another new user',
        isAdmin: true
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Only admins can create admins')
  })

  it('should update a user', async () => {
    const options = {
      method: 'PUT',
      url: '/user/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.adminUserToken
      },
      payload: {
        userId: 'wibble', // will be ignored - just making sure the extra property doesn't cause a 400
        email: 'edited@test.com',
        mobileNumber: '95841239',
        officeNumber: '63458999',
        password: 'letmein', // will be ignored - just making sure the extra property doesn't cause a 400
        activated: true, // will be ignored - just making sure the extra property doesn't cause a 400
        disabled: true, // will be ignored - just making sure the extra property doesn't cause a 400
        name: 'An edited user',
        isAdmin: true // will be ignored - just making sure the extra property doesn't cause a 400
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    delete payload.createdAt
    delete payload.updatedAt

    expect(response.statusCode).to.equal(200)
    expect(payload).to.equal({
      userId: newUserId,
      email: 'edited@test.com',
      mobileNumber: '95841239',
      officeNumber: '63458999',
      password: null,
      activated: false,
      activationCode: newUserActivationCode,
      disabled: false,
      name: 'An edited user',
      isAdmin: false,
      twoFactorEnabled: false,
      twoFactorLogin: false,
      personaliseThirdPartyAds: true,
      receiveCodeMinistryUpdateEmails: true,
      receiveThirdPartyOffers: true,
      privacyPolicyAgreedVersion: null,
      termsOfUseAgreedVersion: null,
      privacyPolicyAgreedVersionHistory: [],
      termsOfUseAgreedVersionHistory: []
    })
  })

  it('should change a user\'s password', async () => {
    const options = {
      method: 'PUT',
      url: '/user/password/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.adminUserToken
      },
      payload: {
        password: 'letmeinbro'
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('Password changed')
  })

  it('should not change a user\'s password for someone without permission', async () => {
    const options = {
      method: 'PUT',
      url: '/user/password/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.standardUserToken
      },
      payload: {
        password: 'letmeinbro'
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(403)
    expect(payload.message).to.equal('Access denied')
  })

  it('should enable a user\'s account', async () => {
    const options = {
      method: 'PUT',
      url: '/user/enable/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.adminUserToken
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('User account enabled')
  })

  it('should not enable a user\'s account for someone without permission', async () => {
    const options = {
      method: 'PUT',
      url: '/user/enable/' + newUserId,
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

  it('should disable a user\'s account', async () => {
    const options = {
      method: 'PUT',
      url: '/user/disable/' + newUserId,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.adminUserToken
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('User account disabled')
  })

  it('should not disable a user\'s account for someone without permission', async () => {
    const options = {
      method: 'PUT',
      url: '/user/disable/' + newUserId,
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

  it('should activate a user\'s account', async () => {
    const options = {
      method: 'PUT',
      url: '/user/activate/' + newUserId + '/' + newUserActivationCode,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.adminUserToken
      }
    }
    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('User activated')
  })

  it('should not activate a user\'s account that is already activated', async () => {
    const options = {
      method: 'PUT',
      url: '/user/activate/' + newUserId + '/' + newUserActivationCode,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.adminUserToken
      }
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
        'Authorization': constants.standardUserToken
      }
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
        'Authorization': constants.adminUserToken
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        secret: 'A super secret string',
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        secret: 'A super secret string',
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        secret: 'A super secret string',
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
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
        'Authorization': constants.standardUserToken
      },
      payload: {
        token: 123456
      }
    }

    const twoFAUtilsStub = sinon.stub(twoFAUtils, 'verify')
    twoFAUtilsStub.returns(true)

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).to.equal(200)
    expect(payload.result).to.equal('Valid token')
    twoFAUtilsStub.restore()
  })

  it('should update a user\'s privacy preferences', async () => {
    const options = {
      method: 'PUT',
      url: '/user/privacy',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.standardUserToken
      },
      payload: {
        personaliseThirdPartyAds: false,
        receiveThirdPartyOffers: false,
        receiveCodeMinistryUpdateEmails: false
      }
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
        'Authorization': constants.standardUserToken
      }
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
        'Authorization': constants.adminUserToken
      }
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
        'Authorization': constants.standardUserToken
      }
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
        'Authorization': constants.adminUserToken
      }
    }
    const checkResponse = await server.inject(checkOptions)
    const checkPayload = JSON.parse(checkResponse.payload)

    expect(checkPayload.privacyPolicyAgreedVersion).to.equal(3)
    expect(checkPayload.privacyPolicyAgreedVersionHistory.length).to.equal(1)
    expect(checkPayload.privacyPolicyAgreedVersionHistory[0].privacyPolicyId).to.equal(3)
  })

  it('should not allow a user to approve an outdated terms of use', async () => {
    const options = {
      method: 'PUT',
      url: '/user/termsOfUse/1/agree',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': constants.standardUserToken
      }
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
        'Authorization': constants.adminUserToken
      }
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
        'Authorization': constants.standardUserToken
      }
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
        'Authorization': constants.adminUserToken
      }
    }
    const checkResponse = await server.inject(checkOptions)
    const checkPayload = JSON.parse(checkResponse.payload)

    expect(checkPayload.termsOfUseAgreedVersion).to.equal(3)
    expect(checkPayload.termsOfUseAgreedVersionHistory.length).to.equal(1)
    expect(checkPayload.termsOfUseAgreedVersionHistory[0].termsOfUseId).to.equal(3)
  })
})
