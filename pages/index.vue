<template>
  <section class="container">
    <logo />
    <hr />
    <nuxt-content :document="page" />
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  name: 'HomePage',
  components: {
    Logo,
  },
  async asyncData({ $content, params, error }) {
    const slug = params.slug || 'index'
    const page = await $content(slug)
      .fetch()
      .catch((err) => {
        console.log(err);
        error({ statusCode: 404, message: 'Page not found' })
      })

    return {
      page,
    }
  },
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
