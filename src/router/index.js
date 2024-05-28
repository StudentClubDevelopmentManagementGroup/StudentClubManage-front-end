import { createRouter, createWebHashHistory } from 'vue-router'
import useStore from "@/store";
import Layout from "@/layout"
import homePageLayout from "@/views/HomePage/layout"

export const constantRoutes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login'),
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
            component: () => import('@/views/welcome'),
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
            component: () => import('@/views/personal'),
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
        component: () => import('../views/error/404.vue'),
        meta: {
            hidden: true,
            hiddenTab: true
        }
    }, {
        path: '/500',
        component: () => import('../views/error/500.vue'),
        meta: {
            hidden: true,
            hiddenTab: true
        }
    },
    {
        path: '/:catchAll(.*)',
        component: () => import('../views/error/404.vue'),
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
            name: "SignIn",
            component: () => import('@/views/sign-in'),
            meta: {
                title: "签到详情",
            },
        }, {
            path: "/run/notice",
            name: "Notice",
            component: () => import('@/views/notice'),
            meta: {
                title: "公告发布",
            },
        }, {
            path: "/run/seat",
            name: "Seat",
            component: () => import('@/views/seat'),
            meta: {
                title: "座位表设置",
            },
        }, {
            path: "/run/duty",
            name: "Duty",
            component: () => import('@/views/duty'),
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
            component: () => import('@/views/activity'),
            meta: {
                title: "活动/比赛发布",
            },
        }, {
            path: "/develop/report",
            name: "Report",
            component: () => import('@/views/report'),
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
            name: "User",
            component: () => import('@/views/user'),
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
            component: () => import('@/views/introduce'),
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
            component: () => import('@/views/member-sign-in/index.vue'),
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
            component: () => import('@/views/member/member-seat'),
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
        redirect: "/teacher/club",
        meta: {
            icon: "ri:file-settings-fill",
            title: "管理模块",
        },
        children: [{
            path: "/teacher/club",
            name: "ClubManagement",
            component: () => import('@/views/admin-management/club'),
            meta: { title: '基地管理' }
        }, {
            path: "/teacher/department",
            name: "DepartmentManagement",
            component: () => import('@/views/admin-management/department'),
            meta: { title: '院系管理' }
        }, {
            path: "/teacher/user",
            name: "UserManagement",
            component: () => import('@/views/admin-management/user'),
            meta: { title: '用户管理' }
        }, {
            path: "/teacher/log",
            name: "Log",
            component: () => import('@/views/admin-management/log'),
            meta: { title: '操作日志' }
        }]
    }
]

export const homePageRoutes = [
    {
        path: "/homepage",
        name: "HomePage",
        redirect: '/home',
        component: homePageLayout,
        children: [
            {
                path: "/home",
                name: "Home",
                component: () => import('@/views/homepage/home.vue'),
                meta: {
                    title: "首页",
                },
            },
            {
                path: "/club",
                name: "Club",
                component: () => import('@/views/homepage/club.vue'),
                meta: {
                    title: "社团信息",
                },
            },
            {
                path: "/recruitment",
                name: "Recruitment",
                component: () => import('@/views/homepage/recruitment.vue'),
                meta: {
                    title: "招新信息",
                },
            },
            {
                path: "/activity",
                name: "AcitivityInfo",
                component: () => import('@/views/homepage/activity.vue'),
                meta: {
                    title: "活动信息",
                },
            }
        ]
    },
    {
        path: '/test',
        name: 'Test',
        meta: { hidden: true, title: '测试' }
    }
]

const MergedRoutes = [...constantRoutes, ...homePageRoutes]

const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior: () => ({
        top: 0
    }),
    routes: MergedRoutes
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