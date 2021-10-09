import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
// import * as ElementIcon from '@element-plus/icons'
import 'element-plus/dist/index.css'
//add Date prototype
import '@/js/DateUtil'
// import {getList} from '@/js/backstage/common/common_data_operation'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
    // app.use(ElementIcon)
app.mount('#app')