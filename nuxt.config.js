const pkg = require('./package')
module.exports = {
  mode: 'universal',
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  // Customize the progress-bar color
  loading: { color: '#fff' },
  // Global CSS
  css: [],
  // Plugins to load before mounting the App
  plugins: [
    { src: '~/plugins/initialise', ssr: false },
    { src: '~/plugins/font-awesome' }
  ],
  // Nuxt.js modules
  modules: [
    // https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // https://github.com/nuxt-community/modules/tree/master/packages/toast
    '@nuxtjs/toast'
  ],
  // Axios module configuration
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  toast: {
    position: 'top-right',
    duration: 5000
  },
  // Build configuration
  build: {
    // You can extend webpack config here
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    prismicApiUrl: process.env.PRISMIC_API_URL || 'https://codeministry.prismic.io/api/v2',
    environment: process.env.NODE_ENV || 'development'
  }
}
