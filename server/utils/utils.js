module.exports.deepCopy = obj => {
  return JSON.parse(JSON.stringify(obj))
}

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
module.exports.arrayIntersection = (
  arr1,
  arr2,
  propName1 = null,
  propName2 = null
) => {
  if (propName1 && propName2) {
    return arr1.filter(el1 =>
      arr2.some(el2 => el2[propName2] === el1[propName1])
    )
  }
  return arr1.filter(el => arr2.includes(el))
}

module.exports.pseudoRandomString = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '') + Date.now()
