import { createRouter, createWebHashHistory } from 'vue-router'
import useStore from "@/store";
import Layout from "@/layout"

export const constantRoutes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login'),
        meta: {
            hidden: true,
            hiddenTab: true,
            title: "登录",
        }
    }, {
        path: "/",
        component: Layout,
        redirect: "/welcome",
        meta: {
            icon: "ri:bar-chart-box-fill",
            title: "首页",
        },
        children: [{
            path: "/welcome",
            name: "Welcome",
            component: () => import('@/views/Welcome'),
            meta: {
                icon: "ri:bar-chart-box-fill",
                title: "首页",
            },
        }]
    }, {
        path: "/personal",
        component: Layout,
        redirect: "/personal/index",
        meta: {
            hidden: true,
            title: "个人中心",
        },
        children: [{
            path: "/personal/index",
            name: "Personal",
            component: () => import('@/views/Personal'),
            meta: {
                title: "个人中心",
            },
        }]
    },
    {
        path: '/403',
        component: () => import('../views/Error/403.vue'),
        meta: {
            hidden: true,
            hiddenTab: true
        }
    }, {
        path: '/404',
        component: () => import('../views/Error/404.vue'),
        meta: {
            hidden: true,
            hiddenTab: true
        }
    }, {
        path: '/500',
        component: () => import('../views/Error/500.vue'),
        meta: {
            hidden: true,
            hiddenTab: true
        }
    },
    {
        path: '/:catchAll(.*)',
        component: () => import('../views/Error/404.vue'),
        meta: {
            hidden: true,
            hiddenTab: true,
            title: "404",
        }
    }
]

export const asyncRoutes = [
    {
        path: "/run",
        component: Layout,
        redirect: "/run/signin",
        meta: {
            icon: "ri:artboard-line",
            title: "基地运营",
        },
        children: [{
            path: "/run/signin",
            name: "Signin",
            component: () => import('@/views/Sign-in'),
            meta: {
                title: "签到详情",
            },
        }, {
            path: "/run/notice",
            name: "Notice",
            component: () => import('@/views/Notice'),
            meta: {
                title: "公告发布",
            },
        }, {
            path: "/run/seat",
            name: "Seat",
            component: () => import('@/views/Seat'),
            meta: {
                title: "座位表设置",
            },
        }, {
            path: "/run/duty",
            name: "Duty",
            component: () => import('@/views/Duty'),
            meta: {
                title: "值日表设置",
            },
        },]
    },
    {
        path: "/develop",
        component: Layout,
        redirect: "/develop/activity",
        meta: {
            icon: "ri:send-plane-fill",
            title: "基地发展",
        },
        children: [{
            path: "/develop/activity",
            name: "Activity",
            component: () => import('@/views/Activity'),
            meta: {
                title: "活动/比赛发布",
            },
        }, {
            path: "/develop/report",
            name: "Report",
            component: () => import('@/views/Report'),
            meta: {
                title: "年终汇报",
            },
        },]
    }, {
        path: "/user",
        component: Layout,
        redirect: "/user/manage",
        meta: {
            icon: "ri:file-user-fill",
            title: "基地人员管理",
        },
        children: [{
            path: "/user/manage",
            name: "Manage",
            component: () => import('@/views/User'),
            meta: {
                icon: "ri:file-user-fill",
                title: "基地人员管理",
            },
        }]
    }, {
        path: "/introduce",
        component: Layout,
        redirect: "/introduce/index",
        meta: {
            icon: "ri:file-text-fill",
            title: "简介设置",
        },
        children: [{
            path: "/introduce/index",
            name: "Introduce",
            component: () => import('@/views/Introduce'),
            meta: {
                icon: "ri:file-text-fill",
                title: "简介设置",
            },
        }]
    }, {
        path: "/member",
        component: Layout,
        redirect: "/member/signin",
        meta: {
            icon: "ri:account-box-fill",
            title: "成员模块",
        },
        children: [{
            path: "/member/signin",
            name: "MemberSignin",
            component: () => import('@/views/Introduce'),
            meta: {
                title: "打卡记录",
            },
        }, {
            path: "/member/duty",
            name: "MemberDuty",
            component: () => import('@/views/Introduce'),
            meta: {
                title: "值日查询",
            },
        }, {
            path: "/member/seat",
            name: "MemberSeat",
            component: () => import('@/views/Introduce'),
            meta: {
                title: "座位表查询",
            },
        }, {
            path: "/member/report",
            name: "MemberReport",
            component: () => import('@/views/Introduce'),
            meta: {
                title: "成果汇报",
            },
        }]
    }, {
        path: "/teacher",
        component: Layout,
        redirect: "/teacher/base",
        meta: {
            icon: "ri:account-box-fill",
            title: "管理模块",
        },
        children: [{
            path: "/teacher/base",
            name: "TeacherBase",
            component: () => import('@/views/admin-management/base-management'),
            meta: { title: '基地管理' }
        }, {
            path: "/teacher/department",
            name: "teacherDepartment",
            component: () => import('@/views/admin-management/department-management'),
            meta: { title: '院系管理' }
        }, {
            path: "/teacher/user",
            name: "teacherUser",
            component: () => import('@/views/admin-management/user-management'),
            meta: { title: '人员管理' }
        }, {
            path: "/teacher/person",
            name: "teacherPerson",
            component: () => import('@/views/admin-management/person-information'),
            meta: { title: '个人信息' }
        }, {
            path: "/teacher/operation",
            name: "teacherOperation",
            component: () => import('@/views/admin-management/operation-log'),
            meta: { title: '操作日志' }
        }]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior: () => ({
        top: 0
    }),
    routes: constantRoutes
})

router.beforeEach(async (to, from, next) => {
    document.title = `${to.meta.title}--基地管理系统`
    const userStore = useStore.userStore
    const tabStore = useStore.tabStore
    const flag = tabStore.getTabsOption.findIndex(tab => tab.route === to.path) > -1
    if (!flag && !to.meta.hiddenTab) {
        tabStore.addTab({ route: to.path, title: to.meta.title, name: to.name })
    }
    tabStore.setCurrentIndex(to.path)

    const hasGetUserInfo = userStore.getUserInfo
    if (to.path === '/login') {
        next()
        return
    }
    if (!hasGetUserInfo) {
        next('/login')
    } else {
        next()
        // next({
        //     path: '/login',
        //     query: { redirect: to.fullPath }
        // })
    }
})

export default router