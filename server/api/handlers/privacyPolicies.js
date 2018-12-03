const Joi = require('joi')
const sqlUtils = require('../../utils/sqlUtils')
const authRequired = require('../validators/authRequired')
const permissionChecks = require('../permissionChecks')
const Boom = require('boom')

module.exports.getLatest = {
  tags: ['api'],
  description: 'Get the latest privacy policy',
  notes: 'Get the latest privacy policy',
  validate: Object.assign({}, authRequired),
  handler: async (request, h) => {
    const db = request.getDb()
    const privacyPolicies = await db.getModel('privacy_policies').findAll({
      limit: 1,
      order: [['created_at', 'DESC']]
    })
    return privacyPolicies.length > 0
      ? sqlUtils.camelCaseDataKeys(privacyPolicies[0])
      : null
  }
}

module.exports.listAll = {
  tags: ['api'],
  description: 'List all versions of the privacy policy',
  notes: 'List all versions of the privacy policy',
  validate: Object.assign({}, authRequired),
  handler: async (request, h) => {
    if (!permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    const db = request.getDb()
    const privacyPolicies = await db.getModel('privacy_policies').findAll({
      order: [['created_at', 'DESC']]
    })
    return sqlUtils.camelCaseDataKeys(privacyPolicies)
  }
}

module.exports.create = {
  tags: ['api'],
  description: 'List all versions of the privacy policy',
  notes: 'List all versions of the privacy policy',
  validate: Object.assign(
    {
      payload: Joi.object({
        versionNotes: Joi.string().required(),
        content: Joi.string().required()
      })
    },
    authRequired
  ),
  handler: async (request, h) => {
    if (!permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    const db = request.getDb()
    const privacyPolicy = await db.getModel('privacy_policies').create({
      version_notes: request.payload.versionNotes,
      content: request.payload.content,
      uploaded_by: request.auth.credentials.userId
    })
    return sqlUtils.camelCaseDataKeys(privacyPolicy)
  }
}
