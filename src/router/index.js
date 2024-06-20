import { createRouter, createWebHashHistory } from 'vue-router'
import useStore from "@/store";
import Layout from "@/layout"
import homePageLayout from "@/views/HomePage"

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
    },
    {
        path: "/personal",
        component: Layout,
        redirect: "/personal/index",
        meta: {
            hidden: true,
            icon: "",
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
        path: "/welcome",
        component: Layout,
        redirect: "/welcome/index",
        meta: {
            icon: "ri:bar-chart-box-fill",
            title: "管理首页",
        },
        children: [{
            path: "/welcome/index",
            name: "Welcome",
            component: () => import('@/views/welcome'),
            meta: {
                icon: "ri:bar-chart-box-fill",
                title: "首页",
            },
        }]
    },
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
            component: () => import('@/views/member-duty'),
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
            component: () => import('@/views/admin-management/club/index'),
            meta: { title: '基地管理' }
        }, {
            path: "/teacher/department",
            name: "DepartmentManagement",
            component: () => import('@/views/admin-management/department/index'),
            meta: { title: '院系管理' }
        }, {
            path: "/teacher/user",
            name: "UserManagement",
            component: () => import('@/views/admin-management/user/index'),
            meta: { title: '用户管理' }
        }, {
            path: "/teacher/log",
            name: "Log",
            component: () => import('@/views/admin-management/log/index'),
            meta: { title: '操作日志' }
        }]
    }
]

export const homePageRoutes = [
    {
        path: "/",
        name: "HomePage",
        redirect: '/homepage/home',
        component: homePageLayout,
        children: [
            {
                path: "/homepage/home",
                name: "Home",
                component: () => import('@/views/homepage/home/index.vue'),
                meta: {
                    fixed: true,
                    hidden: false,
                    title: "首页",
                },
            },
            {
                path: "/homepage/clublist",
                name: "Clublist",
                component: () => import('@/views/homepage/clublist/index.vue'),
                meta: {
                    hidden: true,
                    title: "社团列表",
                }
            },
            {
                path: "/homepage/list",
                name: "List",
                component: () => import('@/views/homepage/list/index.vue'),
                meta: {
                    hidden: true,
                    title: "资讯页",
                },
            },
            {
                path: "/homepage/detail",
                name: "InfoDetail",
                component: () => import('@/views/homepage/detail/index.vue'),
                meta: {
                    hidden: true,
                    title: "详情页",
                },
            },
            {
                path: "/homepage/personal",
                name: "HomepagePersonal",
                component: () => import('@/views/homepage/personal/index.vue'),
                meta: {
                    hidden: true,
                    title: "个人信息",
                },
            }
        ]
    },
]

export const refreshRoutes = [
    {
        path: "/refresh",
        name: "Refresh",
        component: () => import('@/views/Refresh/index.vue'),
    }
]

const MergedRoutes = [...constantRoutes, ...homePageRoutes, ...refreshRoutes]
let HomePageInitFlag = true // 标记是否首次加载界面

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
    let ToHomepageflag = to.path.includes("/homepage") // 检查是否是首页行为

    if (!ToHomepageflag) {
        // 内部管理端导航栏行为
        const tabStore = useStore.tabStore
        const flag = tabStore.getTabsOption.findIndex(tab => tab.route === to.path) > -1
        if (!flag && !to.meta.hiddenTab) {
            tabStore.addTab({ route: to.path, title: to.meta.title, name: to.name })
        }
        tabStore.setCurrentIndex(to.path)
    }

    // 外部首页导航栏行为
    if (ToHomepageflag) {
        const naviStore = useStore.navigationStore
        if (HomePageInitFlag) {
            naviStore.initOptionList();
            HomePageInitFlag = false
        }
        if (!to.meta.hiddenTab) {
            naviStore.addNaviOptions({ path: to.fullPath, meta: to.meta, query: to.query })
        }
        naviStore.setCurrentIndex(to.fullPath)
    }

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