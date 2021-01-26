export default {
  srcDir: 'src/',
  head: {
    titleTemplate: '%s - Melophile',
    title: 'Melophile',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  },
  css: [
    '~/../node_modules/@melophile/melophile-ui/src/styles/app.global.scss',
  ],
  plugins: [
    '~/plugins/melophile-ui.ts',
  ],
  components: true,
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/router',
  ],
  typescript: {
    typeCheck: {
      eslint: {
        files: './**/*.{ts,js,vue}'
      }
    }
  },
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa'
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:4001/api',
      pathRewrite: {
        '^/api': '',
      },
    }
  },
  axios: {},
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: 'theme--',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },
  pwa: {
    manifest: {
      lang: 'en'
    }
  },
  privateRuntimeConfig: {
    dbName: process.env.MONGODB_DB,
    dbUser: process.env.MONGODB_USER,
    dbKey: process.env.MONGODB_KEY,
    spotifyPubID: process.env.SPOTIFY_PUB_ID,
    spotifyPubKey: process.env.SPOTIFY_PUB_KEY,
    spotifySearchID: process.env.SPOTIFY_SEARCH_ID,
    spotifySearchKey: process.env.SPOTIFY_SEARCH_KEY,
    spotifyPrivID: process.env.SPOTIFY_PRIV_ID,
    spotifyPrivKey: process.env.SPOTIFY_PRIV_KEY,
    serverSecret: process.env.SECRET,
    serverState: process.env.STATE,
  },
  build: {
  }
}
