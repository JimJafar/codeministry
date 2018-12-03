const jwt = require('jsonwebtoken')
const env = process.env.NODE_ENV || 'development'

module.exports.getJwtSecret = () => {
  return ['development', 'localtest'].includes(env)
    ? 'Qfs7mHpMuNoUNrYIipnB8GcWiCq11iHiw4mQgzOln8ZEEP73r5HbATElIgzLz26wfzlHIg5qM6TG0QDl2l4IC1wI8Yi78/oCYCL+0VN0AWhUik+pt78WkrL2kZrHCNNNb1WY9XDD+D9AAGvtMDZ5OTGflWhNo9259glzKSMJwqkQZQveGeIfgKnT5yi6rF1C68/pmALNbtMua21w4uUDfozRYYqfrl3lC66UvYfbptqgkrrSMHYqllLIYuVYlByT7qOZi9Q3IB86CnPo6R/Bv2CQ2kGQm+1ASDrc3Cqyq37TRLoTCuWQCfTbY2JqrIRH9t4JOEXkiChiH51cF8fdmw=='
    : process.env.JWT_SECRET
}

module.exports.generateToken = (user, sessionId) => {
  let tokenData = {
    sessionId: sessionId,
    userId: user.userId,
    email: user.email.trim(),
    name: user.name.trim(),
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

  return jwt.sign(tokenData, module.exports.getJwtSecret(), {
    expiresIn: '12h'
  })
}
