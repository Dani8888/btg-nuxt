export default {
  target: 'static',
  ssr: false,
  
  head: {
    title: 'BookingToGo - Travel Booking App',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 
        hid: 'description', 
        name: 'description', 
        content: 'BookingToGo - Your favorite travel booking application with the best prices and services' 
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '@/assets/css/global.css',
    '@/assets/css/dark-mode-fixes.css'
  ],

  components: true,

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    baseURL: 'https://fakestoreapi.com'
  },

  build: {
    extend(config, ctx) {}
  }
}