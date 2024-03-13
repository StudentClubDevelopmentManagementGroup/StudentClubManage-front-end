import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

import 'dayjs/locale/zh-cn'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 引入重置样式
import "./style/reset.scss";
// 导入公共样式
import "./style/index.scss";
import "./style/tailwind.css";
import 'element-plus/dist/index.css'

const app = createApp(App)

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

import IconifyIcon from '@/components/Icon/iconifyIcon'
app.component('IconifyIcon',IconifyIcon)

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(ElementPlus, { zhCn }).mount('#app')