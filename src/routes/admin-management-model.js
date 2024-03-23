import Layout from '@/views/admin-management/index'

// 管理端路由表
export const adminManagementRoutes = [
    {
        path: '/bm',
        redirect: '/bm/base',
        component: Layout,
        children: [
            {
                path: 'base',
                name: 'Base',
                component: () => import('@/views/admin-management/base-management'),
            },
        ]
    },
    {
        path: '/um',
        redirect: '/um/user',
        component: Layout,
        children: [
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/admin-management/user-management'),
            },
        ]
    },
    {
        path: '/pm',
        redirect: '/pm/person',
        component: Layout,
        children: [
            {
                path: 'person',
                name: 'Person',
                component: () => import('@/views/admin-management/person-information'),
            },
        ]
    },
    {
        path: '/om',
        redirect: '/om/operation',
        component: Layout,
        children: [
            {
                path: 'operation',
                name: 'Operation',
                component: () => import('@/views/admin-management/operation-log'),
            }
        ]
    },
]