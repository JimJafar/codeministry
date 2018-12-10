const Auth = require('./handlers/auth')
const Logging = require('./handlers/logging')
// const NotFound = require('./handlers/notFound')
const PrivacyPolicies = require('./handlers/privacyPolicies')
const TermsOfUse = require('./handlers/termsOfUse')
const Time = require('./handlers/time')
const TwoFA = require('./handlers/twoFA')
const Users = require('./handlers/users')

exports.plugin = {
  name: 'api',
  register: (server, options) => {
    server.route([
      // { method: 'GET', path: '/{path*}', config: NotFound.notFound },

      // Time
      { method: 'GET', path: '/time', config: Time.now },

      // Logging
      { method: 'GET', path: '/log/{logId}', config: Logging.find },
      { method: 'GET', path: '/logs', config: Logging.list },
      { method: 'POST', path: '/log', config: Logging.create },
      { method: 'DELETE', path: '/logs', config: Logging.truncate },

      // Auth
      { method: 'POST', path: '/login', config: Auth.login },
      { method: 'POST', path: '/logout', config: Auth.logout },
      { method: 'GET', path: '/checkSession', config: Auth.checkSession },

      // Users
      { method: 'GET', path: '/user/{userId}', config: Users.findById },
      { method: 'GET', path: '/users', config: Users.list },
      { method: 'POST', path: '/register', config: Users.register },
      { method: 'DELETE', path: '/user/{userId}', config: Users.delete },
      { method: 'PUT', path: '/user/{userId}', config: Users.update },
      { method: 'PUT', path: '/user/activate/{userId}/{activationCode}', config: Users.activate },
      { method: 'PUT', path: '/user/disable/{userId}', config: Users.disable },
      { method: 'PUT', path: '/user/enable/{userId}', config: Users.enable },
      { method: 'PUT', path: '/user/password/{userId}', config: Users.changePassword },
      { method: 'PUT', path: '/user/2fa/enable', config: Users.enable2FA },
      { method: 'PUT', path: '/user/2fa/disable', config: Users.disable2FA },
      { method: 'PUT', path: '/user/2fa/enableLogin', config: Users.enable2FALogin },
      { method: 'PUT', path: '/user/2fa/disableLogin', config: Users.disable2FALogin },
      { method: 'POST', path: '/user/2fa/verify', config: Users.verify2FA },
      { method: 'PUT', path: '/user/privacy', config: Users.updatePrivacy },
      { method: 'PUT', path: '/user/privacyPolicy/{privacyPolicyId}/agree', config: Users.agreePrivacyPolicy },
      { method: 'PUT', path: '/user/termsOfUse/{termsOfUseId}/agree', config: Users.agreeTermsOfUse },

      // 2FA
      { method: 'GET', path: '/2fa/generateSecret', config: TwoFA.generate2FASecret },

      // Privacy policies
      { method: 'GET', path: '/privacyPolicies/latest', config: PrivacyPolicies.getLatest },
      { method: 'GET', path: '/privacyPolicies/all', config: PrivacyPolicies.listAll },
      { method: 'POST', path: '/privacyPolicies', config: PrivacyPolicies.create },

      // Terms of use
      { method: 'GET', path: '/termsOfUse/latest', config: TermsOfUse.getLatest },
      { method: 'GET', path: '/termsOfUse/all', config: TermsOfUse.listAll },
      { method: 'POST', path: '/termsOfUse', config: TermsOfUse.create }
    ])
  }
}
