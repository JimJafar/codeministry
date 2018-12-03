const Joi = require('joi')
const sqlUtils = require('../../utils/sqlUtils')
const cryptoUtils = require('../../utils/cryptoUtils')
const logUtil = require('../../utils/logUtil')
const authRequired = require('../validators/authRequired')
const permissionChecks = require('../permissionChecks')
const Boom = require('boom')

module.exports.find = {
  tags: ['api'],
  description: 'Fetch a single log',
  notes: 'Fetch a single log',
  validate: Object.assign({
    params: Joi.object({
      logId: Joi.number().integer().required()
    })
  }, authRequired),
  handler: async (request, h) => {
    if (!permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    const db = request.getDb()
    const log = await db.getModel('logs').findOne({
      where: {
        log_id: request.params.logId
      }
    })
    return sqlUtils.camelCaseDataKeys(log)
  }
}

module.exports.list = {
  tags: ['api'],
  description: 'List all logs',
  notes: 'List all logs',
  validate: Object.assign({}, authRequired),
  handler: async (request, h) => {
    if (!permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    const db = request.getDb()
    const logs = await db.getModel('logs').findAll({
      include: [{
        model: db.getModel('users'),
        as: 'user',
        attributes: ['name', 'email']
      }]
    })
    logs.forEach(log => {
      if (log.user) {
        log.user.email = cryptoUtils.decryptString(log.user.email)
      }
    })
    return sqlUtils.camelCaseDataKeys(logs)
  }
}

module.exports.create = {
  auth: { mode: 'optional', payload: false, strategy: 'jwt' }, // @TODO: Possible vector for abuse?
  tags: ['api'],
  description: 'Add a log',
  notes: 'Add a log',
  // validate: Object.assign({
  validate: {
    payload: Joi.object({
      description: Joi.string().required(),
      message: Joi.string().allow(null),
      code: Joi.string().allow(null, ''),
      type: Joi.number().integer(),
      identifier: Joi.string().allow(null),
      callstack: Joi.array().items(Joi.string()).allow(null),
      deviceInfo: Joi.object({
        browser: Joi.string(),
        os: Joi.string(),
        device: Joi.string(),
        userAgent: Joi.string(),
        os_version: Joi.string()
      }).allow(null)
    })
  },
  handler: async (request, h) => {
    const db = request.getDb()
    const newLog = request.payload
    const identifier = logUtil.getIdentifier(request)

    // block abusive logging
    if (!request.auth.isAuthenticated) {
      const lastTenLogs = await db.getModel('logs').findAll({
        orderBy: ['log_id', 'DESC'],
        limit: 10
      })

      if (lastTenLogs.length === 10 && lastTenLogs.every(log => log.identifier === identifier)) {
        throw Boom.tooManyRequests('Too many requests')
      }
    }

    await db.getModel('logs').create({
      description: newLog.description,
      message: newLog.message,
      code: newLog.code,
      type: newLog.type,
      identifier: identifier,
      callstack: newLog.callstack,
      device_info: newLog.deviceInfo
    })
    return { result: 'Log created' }
  }
}

module.exports.truncate = {
  tags: ['api'],
  description: 'Delete all logs',
  notes: 'Delete all logs',
  validate: Object.assign({}, authRequired),
  handler: async (request, h) => {
    if (!permissionChecks.isAdmin(request)) {
      throw Boom.forbidden('Access denied')
    }
    const db = request.getDb()
    const affectedRows = await db.getModel('logs').destroy({ truncate: true })
    return { result: affectedRows + ' log(s) deleted' }
  }
}
