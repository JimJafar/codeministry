<template>
  <section class="container">
    <div>
      <logo />
      <hr>
      <h1>From prismic:</h1>
      <h1>{{ fields.title }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="fields.content" />
      <img :src="fields.bannerImage.url">
    </div>
  </section>
</template>

<script>
import logo from '~/components/logo.vue'
import Prismic from 'prismic-javascript'
import * as PrismicDOM from 'prismic-dom'
import restrictedRouteMixin from '@/mixins/restricted-route'

export default {
  name: 'HomePage',
  mixins: [restrictedRouteMixin],
  components: {
    logo
  },
  async asyncData (context) {
    const api = await Prismic.getApi(process.env.prismicApiUrl)
    const result = await api.getSingle('home_page')

    if (!result) {
      this.$router.push({ name: 'not-found' })
    }

    return {
      documentId: result.id,
      fields: {
        title: PrismicDOM.RichText.asText(result.data.title),
        bannerImage: result.data.banner_image,
        content: PrismicDOM.RichText.asHtml(result.data.content)
      }
    }
  }
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
