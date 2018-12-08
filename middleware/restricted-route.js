// https://nuxtjs.org/examples/auth-routes/
export default (context) => {
  if (!context.store.state.auth.isAuthenticated) {
    context.store.dispatch('setRedirectPath', context.store.$router.history.pending.fullPath)
    context.redirect('/login')
  }
}
