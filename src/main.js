import { createApp } from 'vue'
import Vuex from '@/store/index'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import '@/js/DateUtil'
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(Vuex)
// app.use(ElementIcon)
app.mount('#app')