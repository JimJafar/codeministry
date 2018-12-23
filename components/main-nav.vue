<template>
  <div>
    <nuxt-link to="/">
      Home
    </nuxt-link>
    <cart-indicator />
    {{ authenticatedUser.name }}
    <a @click="logout" href="#">
      logout
    </a>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'MainNav',
  components: {},
  methods: {
    logout () {
      event.preventDefault()
      AuthService.logout()
      $nuxt.$store.$router.push('login')
    }
  },
  computed: {
    authenticatedUser () {
      return this.$store.state.auth.authenticatedUser || {}
    }
  }
}
</script>

<style>

</style>
