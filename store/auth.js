import xxtea from 'xxtea'
import { getBrowserUid } from '../utils/utils'

export const state = () => ({
  isAuthenticated: false,
  token: null,
  authenticatedUser: {}
})

export const actions = {
  /**
   * Persists AuthService.login response to the store
   * @param context
   * @param authResponse Response object from AuthService.login
   */
  loadSessionFromBackend (context, authResponse) {
    context.commit('loadSessionFromBackend', authResponse)
  },
  /**
   * Clears user and token from store & sets isAuthenticated to false
   * @param context
   */
  unAuthenticate (context) {
    context.commit('unAuthenticate')
  },
  /**
   * Persists localStorage doToken and doUser data to the store
   * @param context
   * @param session
   */
  loadSessionFromLocalStorage (context, session) {
    context.commit('loadSessionFromLocalStorage', session)
  }
}

export const mutations = {
  loadSessionFromBackend (state, authResponse) {
    state.isAuthenticated = true
    state.token = authResponse.data.token
    state.authenticatedUser = authResponse.data.user
  },
  unAuthenticate (state) {
    state.isAuthenticated = false
    state.token = null
    state.authenticatedUser = {}
  },
  loadSessionFromLocalStorage (state, session) {
    state.isAuthenticated = !!session.token
    state.token = session.token
    state.authenticatedUser = session.authenticatedUser ? JSON.parse(xxtea.decrypt(session.authenticatedUser, getBrowserUid())) : {}
  }
}
