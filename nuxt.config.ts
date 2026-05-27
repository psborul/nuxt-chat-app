export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', 'vuetify-nuxt-module', '@nuxt/eslint'],
  // No @mdi/font CSS — Vuetify uses the mdi-svg icon set and we import only
  // the four path constants we actually render, via @mdi/js.
  css: [],
  app: {
    head: {
      title: 'nuxt-chat-app',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'description', name: 'description', content: 'Simple chat on Nuxt.js' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  vuetify: {
    moduleOptions: {
      styles: true,
    },
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi-svg',
      },
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: {
            dark: true,
            colors: {
              primary: '#1976D2',
              secondary: '#FF8F00',
              accent: '#424242',
              info: '#26C6DA',
              warning: '#FFC107',
              error: '#DD2C00',
              success: '#69F0AE',
              background: '#303030',
              surface: '#424242',
            },
          },
        },
      },
    },
  },
  compatibilityDate: '2026-05-28',
})