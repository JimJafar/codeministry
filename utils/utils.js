/**
 * Returns a deep copy of `obj`
 * @param obj
 * @return {any}
 */
export const deepCopy = obj => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Creates a UID for the browser based on several different variables
 * It will never be RFC4122 compliant but it is robust
 * @url https://andywalpole.me/blog/140739/using-javascript-create-guid-from-users-browser-information
 * @returns {string}
 */
export const getBrowserUid = () => {
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
