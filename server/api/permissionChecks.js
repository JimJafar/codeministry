'use strict'
module.exports.isUser = (request, userId) => request.auth.credentials.userId === userId

module.exports.isAdmin = (request) => request.auth.credentials.isAdmin
