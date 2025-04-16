import { createApp } from 'vue'
import App from './App.vue'

import router from '../router/index.js'
import store from '../store/index.js'

import '@/assets/styles/main.scss'
import 'boxicons/css/boxicons.min.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
