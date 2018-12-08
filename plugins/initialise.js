window.onNuxtReady(() => {
  const token = localStorage.getItem('doToken')
  const authenticatedUser = localStorage.getItem('doUser')

  $nuxt.$store.dispatch('auth/loadSession', { token, authenticatedUser })
})
