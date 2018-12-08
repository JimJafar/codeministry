export const state = () => ({
  redirectPath: null
})

export const actions = {
  setRedirectPath (context, path) {
    context.commit('setRedirectPath', path)
  }
}

export const mutations = {
  setRedirectPath (state, path) {
    state.redirectPath = path
  }
}
