const camelCase = require('camelcase')
const snakeCase = require('snake-case')
const moment = require('moment')

/**
 * Converts a boolean to 1 or 0
 * @param boolean
 * @return {number}
 */
module.exports.booleanToSQL = boolean => (boolean ? 1 : 0)

/**
 * Camel cases property names
 * @param data
 * @return {*}
 */
module.exports.camelCaseDataKeys = data => {
  return _changeCase('camel', data)
}

/**
 * Snake cases property names
 * @param data
 * @return {*}
 */
module.exports.snakeCaseDataKeys = data => {
  return _changeCase('snake', data)
}

/**
 * Sorts a Sequelize dataset by the created_at field
 * @param items
 */
module.exports.sortByCreatedAt = items => {
  items.sort((a, b) => {
    if (a.created_at > b.created_at) {
      return 1
    }
    if (a.created_at < b.created_at) {
      return -1
    }
    return 0
  })
}

/**
 * Changes property names of `data` to either snake or camel case
 * @param newCase {'snake'|'camel'}
 * @param data
 * @return {*}
 * @private
 */
const _changeCase = (newCase, data) => {
  if (!data || typeof data !== 'object') {
    return data
  }
  if (Array.isArray(data)) {
    return data.map(item => _changeCase(newCase, item))
  }

  const cased = {}

  if (data.hasOwnProperty('dataValues')) {
    data = data.dataValues
  }

  Object.keys(data).forEach(key => {
    const newKey = newCase === 'snake' ? snakeCase(key) : camelCase(key)
    cased[newKey] = data[key]

    if (
      cased[newKey] instanceof Date &&
      !['created_at', 'updated_at'].includes(key)
    ) {
      cased[newKey] = cased[newKey].toISOString()
      if (cased[newKey].slice(-14) === 'T00:00:00.000Z') {
        cased[newKey] = moment(cased[newKey]).format('YYYY-MM-DD') // strip time from date-only values
      }
    }
    if (
      (cased[newKey] &&
        typeof cased[newKey] === 'object' &&
        cased[newKey].hasOwnProperty('dataValues')) ||
      Array.isArray(cased[newKey])
    ) {
      cased[newKey] = _changeCase(newCase, cased[newKey])
    }
  })
  return cased
}
