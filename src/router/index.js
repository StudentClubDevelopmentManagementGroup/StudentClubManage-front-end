import { createRouter, createWebHashHistory } from 'vue-router'

export const constantRoutes = [
    {
        path: '/',
        name: '登录',
        component: () => import(/* webpackChunkName: "about" */ '@/views/Login'),
        hidden: true
    },
    // {
    //     path: '/:catchAll(.*)',
    //     component: () => import('../views/404'),
    //     hidden: true
    // }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
})


export default router