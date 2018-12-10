import Api from '@/services/Api'
import xxtea from 'xxtea'
import { getBrowserUid } from '../utils/utils'

export default {
  /**
   * Authenticates a user and persists session info to localStorage
   * @param email
   * @param password
   * @return {Promise<*>}
   */
  async login ($store, email, password) {
    let response

    try {
      response = await Api().post('/login', { email, password })
      localStorage.setItem('cmToken', response.data.token)
      localStorage.setItem('cmUser', xxtea.encrypt(JSON.stringify(response.data.user), getBrowserUid()))
      $store.dispatch('auth/authenticate', response)
      $store.$toast.success('Logged in')

      const redirectPath = $store.state.redirectPath || '/products'
      $nuxt.$store.$router.push(redirectPath)
    } catch (err) {
      $store.$toast.error('Log in failed')
    }

    return response
  },

  /**
   * Logs out the current user and clears session info from localStorage
   * @return {Promise<*>}
   */
  logout () {
    localStorage.removeItem('cmToken')
    localStorage.removeItem('cmUser')

    $nuxt.$store.dispatch('auth/unauthenticate')

    return Api().post('/logout', null, { suppressErrors: true }) // suppress errors - user was probably already logged out
  },

  /**
   * Attempts to fetch the authenticated user from the jwt
   * @return {Promise<*>}
   */
  checkSession () {
    return Api().get('/checkSession', { suppressErrors: true }) // suppress errors - session was just invalid
  }
}
