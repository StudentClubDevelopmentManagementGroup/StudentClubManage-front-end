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
import 'animate.css/animate.min.css'

const app = createApp(App)

import { Ripple } from "@/directives/ripple"
app.directive("ripple", Ripple);

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

import { registerStore } from '@/store';
registerStore()
import useStore from '@/store'
useStore.permissionStore.getPermissionRoutes()
useStore.permissionStore.getRoutes()

import iconifyIconOnline from '@/components/Icon/iconifyIconOnline'
import iconifyIconOffline from '@/components/Icon/iconifyIconOffline'
app.component('IconifyIconOnline', iconifyIconOnline)
app.component('IconifyIconOffline', iconifyIconOffline)

import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import VueTippy from "vue-tippy";
app.use(VueTippy);

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 添加全局属性
import axios from 'axios'
app.config.globalProperties.$axios = axios

app.use(router).use(ElementPlus, { zhCn }).mount('#app')