const jwt = require('jsonwebtoken')
const config = require('../../config/server')

module.exports.generateToken = (user, sessionId) => {
  let tokenData = {
    sessionId: sessionId,
    userId: user.userId,
    email: user.email.trim(),
    firstName: user.firstName.trim(),
    lastName: user.lastName.trim(),
    activated: user.activated,
    disabled: user.disabled,
    isAdmin: user.isAdmin,
    receiveCodeMinistryUpdateEmails: user.receiveCodeMinistryUpdateEmails,
    receiveThirdPartyOffers: user.receiveThirdPartyOffers,
    mustAgreeToPrivacyPolicy: user.mustAgreeToPrivacyPolicy,
    mustAgreeToTermsOfUse: user.mustAgreeToTermsOfUse,
    privacyPolicyAgreedVersion: user.privacyPolicyAgreedVersion,
    termsOfUseAgreedVersion: user.termsOfUseAgreedVersion
  }

  return jwt.sign(tokenData, config.jwtSecret, {
    expiresIn: '12h'
  })
}
