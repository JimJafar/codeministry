<template>
  <div class="login">
    <h1>Login</h1>
    <b-form @submit="login">
      <b-form-group
        id="exampleInputGroup1"
        label="Email address:"
        label-for="emailInput"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="emailInput"
          type="email"
          v-model="form.email"
          required
          placeholder="Enter email"
        />
      </b-form-group>
      <b-form-group
        id="exampleInputGroup1"
        label="Password:"
        label-for="passwordInput"
        description="Please keep your password safe."
      >
        <b-form-input
          id="passwordInput"
          type="password"
          v-model="form.password"
          required
          placeholder="Enter password"
        />
      </b-form-group>
      <b-button type="submit" variant="primary">
        Login
      </b-button>
    </b-form>
    <h3>Authenticated: {{ $store.state.auth.isAuthenticated }}</h3>
    <h3>Token: {{ $store.state.auth.token }}</h3>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        email: null,
        password: null
      }
    }
  },
  methods: {
    login (event) {
      event.preventDefault()
      AuthService.login(this.$store, this.form.email, this.form.password)
    }
  }
}
</script>

<style>
</style>
