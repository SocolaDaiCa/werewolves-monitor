// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/ionic',
  ],
  css: [
    '~/assets/css/main.scss',
    '@ionic/vue/css/ionic.bundle.css',
  ],
  nitro: {
    prerender: {
      crawlLinks: false,
    },
  },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1',
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Werewolf Monitor' },
      ],
    },
  },
  i18n: {
    defaultLocale: 'vi',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
    ],
  },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
    // key: 'werewolves-monitor',
    // storageKey: 'werewolves-monitor',
    storageType: 'localStorage',
    // storageOptions: {
    //   key: 'werewolves-monitor',
    // },
  },
  ionic: {
    mode: 'ios', // Force iOS style
  },
})