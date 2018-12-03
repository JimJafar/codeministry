const twoFAUtils = require('../../utils/twoFAUtils')
const authRequired = require('../validators/authRequired')
const Boom = require('boom')
const QRCode = require('qrcode')

module.exports.generate2FASecret = {
  tags: ['api'],
  description: 'Enable 2FA for the user',
  notes: 'Enable 2FA for the user',
  validate: Object.assign({}, authRequired),
  handler: async (request, h) => {
    return new Promise((resolve, reject) => {
      const secret = twoFAUtils.generateSecret(request)
      QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
        if (err) {
          return reject(Boom.internal('Failed to generate QRcode URL'))
        }
        return resolve({ secret: secret.base32, qrCodeUrl: dataUrl })
      })
    })
  }
}
