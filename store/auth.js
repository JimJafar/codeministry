import xxtea from 'xxtea'
import { getBrowserUid } from '../utils/utils'

export const state = () => ({
  isAuthenticated: false,
  token: null,
  authenticatedUser: {}
})

export const actions = {
  authenticate (context, authResponse) {
    context.commit('authenticate', authResponse)
  },
  unauthenticate (context) {
    context.commit('unauthenticate')
  },
  loadSession (context, session) {
    context.commit('loadSession', session)
  }
}

export const mutations = {
  authenticate (state, authResponse) {
    state.isAuthenticated = true
    state.token = authResponse.data.token
    state.authenticatedUser = authResponse.data.user
  },
  unauthenticate (state) {
    state.isAuthenticated = false
    state.token = null
    state.authenticatedUser = {}
  },
  loadSession (state, session) {
    state.isAuthenticated = !!session.token
    state.token = session.token
    state.authenticatedUser = session.authenticatedUser ? JSON.parse(xxtea.decrypt(session.authenticatedUser, getBrowserUid())) : {}
  }
}
