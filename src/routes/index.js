// 作者： a1033a
// 这是详细的路由拆分目录的主 js
// 这里的主要用处是 分开开发路由

// 引入 总的路由表
import router from '@/router/index'

// 引入 我的路由表
import { adminManagementRoutes } from './admin-management-model.js'

// 使用扩展运算符将所有路由添加到 routesAll 数组中
const routesAll = [...adminManagementRoutes]

// 遍历 routesAll 数组，逐个添加路由到 router 中
for (const route of routesAll) {
    router.addRoute(route)
}

export default router
