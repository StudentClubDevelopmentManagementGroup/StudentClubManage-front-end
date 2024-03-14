import { createRouter, createWebHashHistory } from 'vue-router'

export const constantRoutes = [
    {
        path: '/',
        name: '登录',
        component: () => import('@/views/Login'),
        hidden: true
    }, {
        path: '/403',
        component: () => import('../views/Error/403.vue'),
        hidden: true
    }, {
        path: '/404',
        component: () => import('../views/Error/404.vue'),
        hidden: true
    }, {
        path: '/500',
        component: () => import('../views/Error/500.vue'),
        hidden: true
    },
    {
        path: '/:catchAll(.*)',
        component: () => import('../views/Error/404.vue'),
        hidden: true
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
})


export default router