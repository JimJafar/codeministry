/**
 * Returns a deep copy of `obj`
 * @param obj
 * @return {any}
 */
module.exports.deepCopy = obj => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Returns a new array containing unique values. Works fine with arrays of complex values.
 * @param array
 * @return {*}
 */
module.exports.arrayFilterUnique = array => {
  const uniqueStringified = []
  let stringified = null
  return array.reduce((unique, next) => {
    stringified = JSON.stringify(next)
    if (!uniqueStringified.includes(stringified)) {
      uniqueStringified.push(stringified)
      unique.push(next)
    }
    return unique
  }, [])
}

/**
 * Returns a new array containing elements that appear in both arr1 and arr2.
 * If comparing arrays of objects, also provide the property names to compare.
 * @param arr1
 * @param arr2
 * @param propName1
 * @param propName2
 */
module.exports.arrayIntersection = (arr1, arr2, propName1 = null, propName2 = null) => {
  if (propName1 && propName2) {
    return arr1.filter(el1 =>
      arr2.some(el2 => el2[propName2] === el1[propName1])
    )
  }
  return arr1.filter(el => arr2.includes(el))
}

/**
 * Returns quite a random pseudo random string
 * @returns {string}
 */
module.exports.pseudoRandomString = () => {
  const rnd = () => {
    return Math.round(Math.random() * 0xFFFFFFFF).toString(36)
  }

  return Date.now().toString(36) + rnd() + rnd() + rnd()
}

/**
 * Moves {element} in {array} by {offset}
 * @param array
 * @param element
 * @param offset
 */
module.exports.moveInArray = (array, element, offset) => {
  const index = array.indexOf(element)
  if (index + offset >= array.length) {
    offset = array.length - (index + 1)
  }
  if (index + offset <= 0) {
    offset = 0 - index
  }
  array.splice(index + offset, 0, array.splice(index, 1)[0])
}

/**
 * Filters repeated items out of an array returning a new array of unique values
 * @param array
 * @returns {any[]}
 * @see https://davidwalsh.name/array-unique
 */
module.exports.getUnique = (array) => {
  return array.filter((item, index) => {
    return array.indexOf(item) === index
  })
}

/**
 * Creates a UID for the browser based on several different variables
 * It will never be RFC4122 compliant but it is robust
 * @url https://andywalpole.me/blog/140739/using-javascript-create-guid-from-users-browser-information
 * @returns {string}
 */
module.exports.getBrowserUid = () => {
  const nav = window.navigator
  const screen = window.screen
  let uid = nav.mimeTypes.length
  uid += parseInt(nav.userAgent.replace(/\D+/g, ''))
  uid += nav.plugins.length
  uid += screen.height || 0
  uid += screen.width || 0
  uid += screen.pixelDepth || 0

  return uid
}
