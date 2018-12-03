const speakeasy = require('speakeasy')

/**
 * Generates a 2FA secret
 * @returns {GeneratedSecret}
 */
module.exports.generateSecret = request => {
  return speakeasy.generateSecret({
    length: 32,
    symbols: false,
    otpauth_url: true,
    name: `codeministry: ${request.auth.credentials.email}`,
    issuer: 'codeministry'
  })
}

module.exports.verify = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 3,
    step: 30
  })
}
