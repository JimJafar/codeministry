const camelCase = require('camelcase')
const snakeCase = require('snake-case')
const moment = require('moment')

module.exports.booleanToSQL = boolean => (boolean ? 1 : 0)

module.exports.camelCaseDataKeys = data => {
  return _changeCase('camel', data)
}

module.exports.snakeCaseDataKeys = data => {
  return _changeCase('snake', data)
}

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
