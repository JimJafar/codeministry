const cryptoUtils = require('./cryptoUtils')
const sqlUtils = require('./sqlUtils')

/**
 * Camel cases and sanitises a user
 * @param user
 * @returns {*}
 */
module.exports.sanitiseUser = (user) => {
  user = sqlUtils.camelCaseDataKeys(user)
  user.password = null // do not return hashed password to the front end
  delete user.twoFactorSecret // do not return the 2FA secret to the front end
  user.email = cryptoUtils.decryptString(user.email)
  return user
}
