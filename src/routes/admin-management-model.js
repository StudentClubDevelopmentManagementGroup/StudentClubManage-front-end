// 管理端路由表
export const adminManagementRoutes = [
    {
        path: '/management',
        redirect: '/management/base',
        component: () => import('@/views/admin-management'),
        children: [
            {
                path: 'base',
                name: 'Base',
                component: () => import('@/views/admin-management/base-management'),
            },
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/admin-management/user-management'),
            },
            {
                path: 'person',
                name: 'Person',
                component: () => import('@/views/admin-management/person-information'),
            },
            {
                path: 'operation',
                name: 'Operation',
                component: () => import('@/views/admin-management/operation-log'),
            }
        ]
    },
]