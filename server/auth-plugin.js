const consola = require('consola')
const moment = require('moment')
const authUtils = require('./utils/authUtils')

module.exports.plugin = {
  name: 'auth',
  register: (server, options) => {
    server.auth.strategy('jwt', 'jwt', {
      key: authUtils.getJwtSecret(),
      verifyOptions: {
        // allow expired tokens when running automated tests
        algorithms: ['HS256'],
        ignoreExpiration: process.env.NODE_ENV === 'localtest'
      },
      validate: async (decoded, request, h) => {
        if (request.url.path === '/api/logout') {
          return {
            isValid: true
          }
        }
        const db = request.getDb()
        try {
          const dbSession = await db.getModel('sessions').findOne({
            where: {
              session_id: decoded.sessionId
            }
          })
          if (!dbSession) {
            return {
              isValid: false,
              response: h.response('Session not found').code(401)
            }
          }
          if (dbSession.user_id !== decoded.userId) {
            return {
              isValid: false,
              response: h.response('Session access denied').code(401)
            }
          }
          if (moment(dbSession.expires) < moment()) {
            try {
              await dbSession.destroy()
              return {
                isValid: false,
                response: h.response('Session expired').code(401)
              }
            } catch (err) {
              consola.log(
                `Session could not bedeleted: ${err ? err.message : ''}`
              )
              return {
                isValid: false,
                response: h.response('Session could not be deleted').code(401)
              }
            }
          }

          dbSession.expires = moment()
            .add(30, 'minutes')
            .utc()
            .format()

          try {
            await dbSession.save()
            return { isValid: true }
          } catch (err) {
            consola.log('Session update failed: ' + (err ? err.message : ''))
            return {
              isValid: false,
              response: h.response('Session update failed').code(401)
            }
          }
        } catch (err) {
          return {
            isValid: false,
            response: h.response('Internal server error').code(401)
          }
        }
      }
    }) // Uncomment this to apply default auth to all routes
    server.auth.default('jwt')
  }
}
