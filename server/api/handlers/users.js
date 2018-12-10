const Joi = require('joi')
const bcrypt = require('bcryptjs')
const aguid = require('aguid')
const cryptoUtils = require('../../utils/cryptoUtils')
const userUtils = require('../../utils/userUtils')
const utils = require('../../utils/utils')
const twoFAUtils = require('../../utils/twoFAUtils')
const authRequired = require('../validators/authRequired')
const permissionChecks = require('../permissionChecks')
const Boom = require('boom')

module.exports.findById = {
  tags: ['api'],
  description: 'Fetch a single user account',
  notes: 'Fetch a single user account',
  validate: Object.assign(
    {
      params: Joi.object({
        userId: Joi.string().required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.params.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    if (
      !permissionChecks.isAdmin(request) &&
      !permissionChecks.isUser(request, user.user_id)
    ) {
      throw Boom.forbidden('Access denied')
    }
    return userUtils.sanitiseUser(user)
  }
}

module.exports.list = {
  tags: ['api'],
  description: 'List all user accounts',
  notes: 'List all user accounts',
  validate: Object.assign({}, authRequired),
  handler: async (request, h) => {
    if (!permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    const db = request.getDb()
    const users = await db.getModel('users').findAll()
    return users.map(user => userUtils.sanitiseUser(user))
  }
}

module.exports.register = {
  tags: ['api'],
  description: 'Create a user account',
  notes: 'Create a user account',
  validate: Object.assign(
    {
      payload: Joi.object({
        email: Joi.string()
          .email()
          .required(),
        mobileNumber: Joi.string().allow(null, ''),
        officeNumber: Joi.string().allow(null, ''),
        password: Joi.string().allow(null),
        activated: Joi.boolean(),
        disabled: Joi.boolean(),
        name: Joi.string()
          .min(2)
          .required(),
        isAdmin: Joi.boolean().required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const newUser = request.payload
    const password = newUser.password || utils.pseudoRandomString()

    if (!permissionChecks.isAdmin(request) && newUser.isAdmin) {
      throw Boom.forbidden('Only admins can create admins')
    }

    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return reject(Boom.internal('Hashing error'))
        }
        const db = request.getDb()
        const userId = aguid()
        let user

        try {
          user = await db.getModel('users').create({
            user_id: userId,
            email: cryptoUtils.encryptStringDeterministic(newUser.email),
            mobile_number: newUser.mobileNumber,
            office_number: newUser.officeNumber,
            password: hash,
            activated: newUser.activated,
            activation_code: aguid(),
            disabled: newUser.disabled,
            name: newUser.name,
            is_admin: newUser.isAdmin
          })
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            return reject(Boom.conflict('Email already registered'))
          }
          return reject(Boom.internal('Account could not be created.', e))
        }
        return resolve(userUtils.sanitiseUser(user))
      })
    })
  }
}

module.exports.update = {
  tags: ['api'],
  description: 'Update a user account',
  notes: 'Update a user account',
  validate: Object.assign(
    {
      params: Joi.object({
        userId: Joi.string().required()
      }),
      payload: Joi.object({
        email: Joi.string()
          .email()
          .required(),
        mobileNumber: Joi.string().allow(null, ''),
        officeNumber: Joi.string().allow(null, ''),
        name: Joi.string()
          .min(2)
          .required()
      }).options({ allowUnknown: true })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const updatedUser = request.payload

    if (!permissionChecks.isUser(request, request.params.userId) && !permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }

    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.params.userId
      }
    })
    user.email = cryptoUtils.encryptStringDeterministic(updatedUser.email)
    user.mobile_number = updatedUser.mobileNumber
    user.office_number = updatedUser.officeNumber
    user.name = updatedUser.name

    await user.save()
    return userUtils.sanitiseUser(user)
  }
}

module.exports.changePassword = {
  tags: ['api'],
  description: 'Update a user password',
  notes: 'Update a user password',
  validate: Object.assign(
    {
      params: Joi.object({
        userId: Joi.string().required()
      }),
      payload: Joi.object({
        password: Joi.string()
          .min(2)
          .required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    if (
      !permissionChecks.isUser(request, request.params.userId) &&
      !permissionChecks.isAdmin(request)
    ) {
      throw Boom.forbidden('Access denied')
    }

    return new Promise((resolve, reject) => {
      bcrypt.hash(request.payload.password, 10, async (err, hash) => {
        if (err) {
          return reject(Boom.internal('Hashing error'))
        }

        const db = request.getDb()
        const user = await db.getModel('users').findOne({
          where: {
            user_id: request.params.userId
          }
        })
        user.password = hash

        await user.save()
        return resolve({ result: 'Password changed' })
      })
    })
  }
}

module.exports.activate = {
  tags: ['api'],
  description: 'Activate a user account',
  notes: 'Activate a user account',
  validate: Object.assign(
    {
      params: Joi.object({
        userId: Joi.string().required(),
        activationCode: Joi.string().required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.params.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    if (user.activated) {
      throw Boom.badRequest('User already activated')
    }
    if (user.activation_code !== request.params.activationCode) {
      throw Boom.badRequest('Invalid activation code')
    }
    user.activated = true
    await user.save()
    return { result: 'User activated' }
  }
}

module.exports.disable = {
  tags: ['api'],
  description: 'Disable a user account',
  notes: 'Disable a user account',
  validate: Object.assign(
    {
      params: Joi.object({
        userId: Joi.string().required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.params.userId
      }
    })
    if (user && !permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    user.disabled = true
    await user.save()
    return { result: 'User account disabled' }
  }
}

module.exports.enable = {
  tags: ['api'],
  description: 'Enable a user account',
  notes: 'Enable a user account',
  validate: Object.assign(
    {
      params: Joi.object({
        userId: Joi.string().required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.params.userId
      }
    })
    if (user && !permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    user.disabled = false
    await user.save()
    return { result: 'User account enabled' }
  }
}

module.exports.delete = {
  tags: ['api'],
  description: 'Delete a single user account',
  notes: 'Delete a single user account',
  validate: Object.assign(
    {
      params: Joi.object({
        userId: Joi.string().required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.params.userId
      }
    })
    if (user && !permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    await user.destroy()
    return { result: 'User deleted' }
  }
}

module.exports.enable2FA = {
  tags: ['api'],
  description: 'Enable 2FA for the user',
  notes: 'Enable 2FA for the user',
  validate: Object.assign(
    {
      payload: Joi.object({
        secret: Joi.string().required(),
        token: Joi.number()
          .integer()
          .required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    if (!twoFAUtils.verify(request.payload.secret, request.payload.token)) {
      throw Boom.forbidden('Invalid token')
    }
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.auth.credentials.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    if (user.two_factor_enabled) {
      throw Boom.badRequest('2FA already enabled')
    }
    user.two_factor_enabled = true
    user.two_factor_secret = request.payload.secret
    await user.save()
    return { result: '2FA enabled', secret: request.payload.secret }
  }
}

module.exports.disable2FA = {
  tags: ['api'],
  description: 'Enable 2FA for the user',
  notes: 'Enable 2FA for the user',
  validate: Object.assign(
    {
      payload: Joi.object({
        token: Joi.number()
          .integer()
          .required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.auth.credentials.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    if (!twoFAUtils.verify(user.two_factor_secret, request.payload.token)) {
      throw Boom.forbidden('Invalid token')
    }
    if (!user.two_factor_enabled) {
      throw Boom.badRequest('2FA already disabled')
    }
    user.two_factor_enabled = false
    user.two_factor_secret = null
    await user.save()
    return { result: '2FA disabled' }
  }
}

module.exports.enable2FALogin = {
  tags: ['api'],
  description: 'Require 2FA login for the user',
  notes: 'Require 2FA login for the user',
  validate: Object.assign(
    {
      payload: Joi.object({
        token: Joi.number()
          .integer()
          .required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.auth.credentials.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    if (!twoFAUtils.verify(user.two_factor_secret, request.payload.token)) {
      throw Boom.forbidden('Invalid token')
    }
    if (user.two_factor_login) {
      throw Boom.badRequest('2FA login already enabled')
    }
    user.two_factor_login = true
    await user.save()
    return { result: '2FA login enabled', secret: request.payload.secret }
  }
}

module.exports.disable2FALogin = {
  tags: ['api'],
  description: 'Disable 2FA login for the user',
  notes: 'Disable 2FA login for the user',
  validate: Object.assign(
    {
      payload: Joi.object({
        token: Joi.number()
          .integer()
          .required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.auth.credentials.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    if (!twoFAUtils.verify(user.two_factor_secret, request.payload.token)) {
      throw Boom.forbidden('Invalid token')
    }
    if (!user.two_factor_login) {
      throw Boom.badRequest('2FA login already disabled')
    }
    user.two_factor_login = false
    await user.save()
    return { result: '2FA login disabled' }
  }
}

module.exports.verify2FA = {
  tags: ['api'],
  description: 'Verify a 2FA token for the user',
  notes: 'Verify a 2FA token for the user',
  validate: Object.assign(
    {
      payload: Joi.object({
        token: Joi.number()
          .integer()
          .required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.auth.credentials.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    if (twoFAUtils.verify(user.two_factor_secret, request.payload.token)) {
      return { result: 'Valid token' }
    }
    throw Boom.forbidden('Invalid token')
  }
}

module.exports.updatePrivacy = {
  tags: ['api'],
  description: 'Update privacy settings for a user account',
  notes: 'Update privacy settings for a user account',
  validate: Object.assign(
    {
      payload: Joi.object({
        personaliseThirdPartyAds: Joi.boolean().required(),
        receiveThirdPartyOffers: Joi.boolean().required(),
        receiveCodeMinistryUpdateEmails: Joi.boolean().required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()
    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.auth.credentials.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    user.personalise_third_party_ads = request.payload.personaliseThirdPartyAds
    user.receive_third_party_offers = request.payload.receiveThirdPartyOffers
    user.receive_mx_update_emails = request.payload.receiveCodeMinistryUpdateEmails

    await user.save()
    return { result: 'User privacy settings updated' }
  }
}

module.exports.agreePrivacyPolicy = {
  tags: ['api'],
  description: 'Agree to the privacy policy',
  notes: 'Agree to the privacy policy',
  validate: Object.assign(
    {
      params: Joi.object({
        privacyPolicyId: Joi.number()
          .integer()
          .required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()

    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.auth.credentials.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    if (user.privacy_policy_agreed_version === request.params.privacyPolicyId) {
      throw Boom.badRequest(
        `Version ${request.params.privacyPolicyId} already agreed`
      )
    }

    const latestVersion = await db
      .getModel('privacy_policies')
      .max('privacy_policy_id')
    if (request.params.privacyPolicyId !== latestVersion) {
      throw Boom.badRequest(
        `${request.params.privacyPolicyId} is not the latest version`
      )
    }

    user.privacy_policy_agreed_version = request.params.privacyPolicyId
    user.privacy_policy_agreed_version_history = [
      ...user.privacy_policy_agreed_version_history,
      {
        privacyPolicyId: request.params.privacyPolicyId,
        date: new Date().toISOString(),
        ip: request.info.remoteAddress
      }
    ]

    await user.save()
    return {
      result: `Privacy policy version ${request.params.privacyPolicyId} agreed`
    }
  }
}

module.exports.agreeTermsOfUse = {
  tags: ['api'],
  description: 'Agree to the terms of use',
  notes: 'Agree to the terms of use',
  validate: Object.assign(
    {
      params: Joi.object({
        termsOfUseId: Joi.number()
          .integer()
          .required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    const db = request.getDb()

    const user = await db.getModel('users').findOne({
      where: {
        user_id: request.auth.credentials.userId
      }
    })
    if (!user) {
      throw Boom.badRequest('User not found')
    }
    if (user.terms_of_use_agreed_version === request.params.termsOfUseId) {
      throw Boom.badRequest(
        `Version ${request.params.termsOfUseId} already agreed`
      )
    }

    const latestVersion = await db
      .getModel('terms_of_use')
      .max('terms_of_use_id')

    if (request.params.termsOfUseId !== latestVersion) {
      throw Boom.badRequest(
        `${request.params.termsOfUseId} is not the latest version`
      )
    }

    user.terms_of_use_agreed_version = request.params.termsOfUseId
    user.terms_of_use_agreed_version_history = [
      ...user.terms_of_use_agreed_version_history,
      {
        termsOfUseId: request.params.termsOfUseId,
        date: new Date().toISOString(),
        ip: request.info.remoteAddress
      }
    ]

    await user.save()
    return {
      result: `Terms of use version ${request.params.termsOfUseId} agreed`
    }
  }
}
