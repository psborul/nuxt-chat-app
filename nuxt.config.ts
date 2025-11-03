// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  css: ["~/assets/main.scss"],
  ssr: false,
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  nitro: {
    experimental: {
      websocket: true,
    },

    devProxy: {
      "/v1/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/chat/v1/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/messages/v1/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
vite: {
    server: {
      proxy: {
        "/ws": {
          target: "ws://localhost:3001", // or 'ws://...' both OK
          changeOrigin: true,
          ws: true,
        },
      },
    },
  },
});
