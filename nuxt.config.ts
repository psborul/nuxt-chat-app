// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  css: ['~/assets/main.scss'],
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  nitro: {
    experimental: {
      websocket: true
    },
  }
});