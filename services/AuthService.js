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
      localStorage.setItem('doToken', response.data.token)
      localStorage.setItem('doUser', xxtea.encrypt(JSON.stringify(response.data.user), getBrowserUid()))
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
  async logout () {
    localStorage.removeItem('doToken')
    localStorage.removeItem('doUser')

    $nuxt.$store.dispatch('auth/unauthenticate')

    let response
    try {
      response = await Api().post('/logout', null, { suppressErrors: true })
    } catch (e) { /* nothing to do - user was probably already logged out */ }

    return response
  }
}
