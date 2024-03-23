import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from "@/store/user.js"
import { useTabStore } from "@/store/tab.js"
import Layout from "@/layout"

export const constantRoutes = [
    {
        path: '/login',
        name: '登录',
        component: () => import('@/views/Login'),
        meta: {
            hidden: true,
            hiddenTab: true
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
            hiddenTab: true
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
    },{
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
        },{
            path: "/member/duty",
            name: "MemberDuty",
            component: () => import('@/views/Introduce'),
            meta: {
                title: "值日查询",
            },
        },{
            path: "/member/seat",
            name: "MemberSeat",
            component: () => import('@/views/Introduce'),
            meta: {
                title: "座位表查询",
            },
        },{
            path: "/member/report",
            name: "MemberReport",
            component: () => import('@/views/Introduce'),
            meta: {
                title: "成果汇报",
            },
        }]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior: () => ({
        top: 0
    }),
    routes: constantRoutes
})

router.beforeEach(async (to, from, next) => {
    document.title = `${to.meta.title}-基地管理系统`
    const userStore = useUserStore()
    const tabStore = useTabStore()
    const flag = tabStore.getTabsOption.findIndex(tab => tab.route === to.path) > -1
    if (!flag && !to.meta.hiddenTab) {
        tabStore.addTab({ route: to.path, title: to.meta.title, name: to.name })
    }
    tabStore.setCurrentIndex(to.path)

    const hasGetUserInfo = userStore.state.userInfo
    if (to.path === '/login') {
        next()
        return
    }
    if (!hasGetUserInfo) {
        next('/login')
    } else {
        next()
    }
})

export default router