const moment = require('moment')

/**
 * Determines the number of years between now and a given time
 * @param time {moment.Moment}
 * @returns {number}
 */
module.exports.getYearsUntil = time => {
  return moment().diff(time, 'years')
}

/**
 * Determines the number of days between two dates
 * @param {string} firstDate
 * @param {string} secondDate
 * @returns {number}
 */
module.exports.diffInDays = (firstDate, secondDate) => {
  return moment(firstDate).diff(moment(secondDate), 'days')
}
