const config = require('../../config/server')
const Mailgun = require('mailgun-js')

/**
 * Sends an email
 * @param to
 * @param subject
 * @param preTitle
 * @param mainTitle
 * @param html
 * @param from
 * @return {*}
 */
module.exports.sendEmail = (to, subject, preTitle, mainTitle, html, from = 'support@codeministry.com') => {
  const mailgun = new Mailgun({ apiKey: config.mailgunKey, domain: config.mailgunDomain })
  const data = {
    from,
    to,
    subject,
    html
  }
  return mailgun.messages().send(data)
}
