const moment = require('moment')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const aguid = require('aguid')
const utils = require('../../utils/utils')
const authUtils = require('../../utils/authUtils')
const sqlUtils = require('../../utils/sqlUtils')
const cryptoUtils = require('../../utils/cryptoUtils')
const authRequired = require('../validators/authRequired')
const Boom = require('@hapi/boom')

/**
 * Authenticate a user
 * @type {{auth: boolean, tags: string[], description: string, notes: string, validate: {payload: *}, handler: (function(*=, *): Promise<*>)}}
 */
module.exports.login = {
  auth: false,
  tags: ['api'],
  description: 'Authenticate a user',
  notes: 'Authenticate a user',
  validate: {
    payload: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(2)
        .required()
    })
  },
  handler: async (request, h) => {
    const db = request.getDb()
    const credentials = request.payload

    const user = await db.getModel('users').findOne({
      where: {
        email: cryptoUtils.encryptStringDeterministic(credentials.email)
      }
    })

    if (!user) {
      throw Boom.badRequest('Invalid credentials')
    }
    if (!user.activated) {
      throw Boom.forbidden('Inactive')
    }
    if (user.disabled) {
      throw Boom.forbidden('Disabled')
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(credentials.password, user.password, async (err, res) => {
        if (err) {
          return reject(Boom.internal('Hash comparison error'))
        }
        if (!res) {
          return reject(Boom.badRequest('Invalid credentials'))
        }
        const affectedRows = await db.getModel('sessions').destroy({
          where: {
            user_id: user.user_id
          }
        })
        if (affectedRows > 0) {
          request.server.publish(`/loggedInElsewhere/${user.user_id}`, null)
        }
        const sessionId = aguid()
        await db.getModel('sessions').create({
          session_id: sessionId,
          user_id: user.user_id,
          expires: moment()
            .add(30, 'minutes')
            .utc()
            .format()
        })

        const latestPrivacyPolicyVersion = await db
          .getModel('privacy_policies')
          .max('privacy_policy_id')
        const latestTermsOfUseVersion = await db
          .getModel('terms_of_use')
          .max('terms_of_use_id')

        let userData = utils.deepCopy(user.dataValues)
        userData.email = cryptoUtils.decryptString(user.email)
        userData.mustAgreeToPrivacyPolicy = userData.privacy_policy_agreed_version !== latestPrivacyPolicyVersion
        userData.mustAgreeToTermsOfUse = userData.terms_of_use_agreed_version !== latestTermsOfUseVersion
        delete userData.password
        delete userData.created_at
        delete userData.updated_at
        userData = sqlUtils.camelCaseDataKeys(userData)

        resolve({
          token: authUtils.generateToken(userData, sessionId),
          user: userData,
          result: 'Success'
        })
      })
    })
  }
}

/**
 * Logout the current user
 * @type {{tags: string[], description: string, notes: string, validate: ({} & {headers}) | any, handler: (function(*, *): {result: string})}}
 */
module.exports.logout = {
  tags: ['api'],
  description: 'Logout the current user',
  notes: 'Logout the current user',
  validate: Object.assign({}, authRequired),
  handler: async (request, h) => {
    const db = request.getDb()
    await db.getModel('sessions').destroy({
      where: {
        session_id: request.auth.credentials.sessionId
      }
    })
    return { result: 'Logged out' }
  }
}

/**
 * A simple method that will return 403 if jwt is invalid
 * @type {{tags: string[], description: string, notes: string, validate: ({} & {headers}) | any, handler: (function(*, *): {sessionValid: boolean})}}
 */
module.exports.checkSession = {
  tags: ['api'],
  description: 'Check if the session is valid',
  notes: 'Check if the session is valid',
  validate: Object.assign({}, authRequired),
  handler: (request, h) => {
    return { sessionValid: true }
  }
}
