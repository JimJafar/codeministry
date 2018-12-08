/**
 * Global axios response error handler
 * To suppress error handling, do this: `Api().get('/user/1', { suppressErrors: true })`
 */
const use = axios => {
  axios.interceptors.response.use(
    response => response,
    (error) => {
      const redirectExclusions = ['/logout', '/login', '/']

      if (error.config.hasOwnProperty('suppressErrors') && error.config.suppressErrors === true) {
        return Promise.reject(error)
      }

      if (error.response.status === 401 && !redirectExclusions.includes(error.config.url.replace(error.config.baseURL, '/'))) {
        if (!$nuxt.$store.state.redirectPath) {
          $nuxt.$store.dispatch('setRedirectPath', $nuxt.$store.$router.curentRoute.fullPath)
        }
        $nuxt.$store.$router.push({ path: '/logout' })
      }

      if (error.response.status === 0) {
        $nuxt.$store.$router.push({ path: '/maintenance' })
      }

      if (error.response) {
        $nuxt.$store.$toast.error(error.response.data.message)
      }
    })
}

export default { use }
