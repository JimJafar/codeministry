import AuthService from '@/services/AuthService'

export default {
  beforeMount: (context) => {
    if (!$nuxt.$store.state.auth.isAuthenticated) {
      // no session in vuex store
      console.warn('no session in vuex store')
      const token = localStorage.getItem('cmToken')

      if (!token) {
        // no session in local storage
        console.warn('no session in local storage')
        return redirectToLogin()
      }

      // load the session info from localStorage into the vuex store
      const authenticatedUser = localStorage.getItem('cmUser')
      $nuxt.$store.dispatch('auth/loadSessionFromLocalStorage', { token, authenticatedUser })

      AuthService.checkSession()
        .then(() => {
          // session valid
          console.log('session valid')
        })
        .catch(() => {
          // session invalid
          console.warn('session invalid')
          redirectToLogin()
        })
    }
  }
}

const redirectToLogin = () => {
  if ($nuxt.$store.$router.history.pending) {
    $nuxt.$store.dispatch('setRedirectPath', $nuxt.$store.$router.history.pending.fullPath)
  } else {
    $nuxt.$store.dispatch('setRedirectPath', $nuxt.$store.$router.history.current.fullPath)
  }
  $nuxt.$router.replace('/login')
}
