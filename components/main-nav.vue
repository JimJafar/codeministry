<template>
  <div>
    {{ authenticatedUser.name }}
    <a href="#" @click="logout">
      logout
    </a>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'MainNav',
  components: {},
  computed: {
    authenticatedUser () {
      return this.$store.state.auth.authenticatedUser || {}
    }
  },
  methods: {
    logout () {
      event.preventDefault()
      AuthService.logout()
      $nuxt.$store.$router.push('login')
    }
  }
}
</script>

<style>

</style>
