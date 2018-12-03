const Joi = require('joi')
const sqlUtils = require('../../utils/sqlUtils')
const authRequired = require('../validators/authRequired')
const permissionChecks = require('../permissionChecks')
const Boom = require('boom')

module.exports.getLatest = {
  tags: ['api'],
  description: 'Get the latest terms of use',
  notes: 'Get the latest terms of use',
  validate: Object.assign({}, authRequired),
  handler: async (request, h) => {
    const db = request.getDb()
    const termsOfUse = await db.getModel('terms_of_use').findAll({
      limit: 1,
      order: [['created_at', 'DESC']]
    })
    return termsOfUse.length > 0
      ? sqlUtils.camelCaseDataKeys(termsOfUse[0])
      : null
  }
}

module.exports.listAll = {
  tags: ['api'],
  description: 'List all versions of the terms of use',
  notes: 'List all versions of the terms of use',
  validate: Object.assign({}, authRequired),
  handler: async (request, h) => {
    if (!permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    const db = request.getDb()
    const termsOfUse = await db.getModel('terms_of_use').findAll({
      order: [['created_at', 'DESC']]
    })
    return sqlUtils.camelCaseDataKeys(termsOfUse)
  }
}

module.exports.create = {
  tags: ['api'],
  description: 'List all versions of the terms of use',
  notes: 'List all versions of the terms of use',
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
    const termsOfUse = await db.getModel('terms_of_use').create({
      version_notes: request.payload.versionNotes,
      content: request.payload.content,
      uploaded_by: request.auth.credentials.userId
    })
    return sqlUtils.camelCaseDataKeys(termsOfUse)
  }
}
