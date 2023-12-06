import ArcoVue from '@arco-design/web-vue'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'

import '@arco-design/web-vue/dist/arco.css'
import './styles/main.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})
app.use(router)
app.use(ArcoVue)
app.mount('#app')
