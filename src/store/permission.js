import { defineStore } from 'pinia'
import { ref } from 'vue'
import router, { constantRoutes, asyncRoutes } from '@/router'

export const usePermissionStore = defineStore('permission', () => {
    const roles = ref(localStorage.getItem('role') || '')
    const permissions = ref([])
    const accessRoutes = ref(constantRoutes)
    const routes = ref(constantRoutes)
    const authedRoutes = ref([])

    const setRoles = (roleName) => {
        roles.value = roleName
    }

    const setAccessRoutes = (newRoutes) => {
        accessRoutes.value = constantRoutes.concat(newRoutes)
    }

    const setRoutes = (newRoutes) => {
        routes.value = constantRoutes.concat(newRoutes)
    }

    const setAuthedRoutes = (newAuthedRoutes) => {
        authedRoutes.value = newAuthedRoutes
        localStorage.setItem('authedRoutes', JSON.stringify(newAuthedRoutes))
    }

    const setPermissions = (newPermissions) => {
        permissions.value = newPermissions
    }

    const getPermissionRoutes = async (payload) => {
        const newAuthedRoutes = ["/run", "/develop", "/user", "/introduce", "/member","/teacher"]
        setAuthedRoutes(newAuthedRoutes)
        const accessedRoutes = []

        for (const path of newAuthedRoutes) {
            for (const item of asyncRoutes) {
                if (item.path === path) {
                    accessedRoutes.push(item)
                }
            }
        }
        // 动态添加路由  vue-router4.x 暂时没有addRoutes
        router.isReady().then(() => {
            accessedRoutes.forEach((route) => {
                const routeName = route.name
                if (!router.hasRoute(routeName)) {
                    router.addRoute(route)
                }
            })
            router.options.routes = constantRoutes.concat(asyncRoutes)
            setAccessRoutes(accessedRoutes)
        })
    }

    const getPermissions = async () => {
        const newpermissions = ['test:permission-btn', 'test:permission-btn2', 'test:permission-btn3']
        setPermissions(newpermissions)
    }

    const getRoutes = () => {
        const storedAuthedRoutes = localStorage.getItem('authedRoutes')
        if (storedAuthedRoutes) {
            const parsedAuthedRoutes = JSON.parse(storedAuthedRoutes)
            const accessedRoutes = parsedAuthedRoutes.map((path) =>
                asyncRoutes.find((route) => route.path === path)
            ).filter(Boolean)

            accessedRoutes.forEach((route) => {
                const routeName = route.name
                if (!router.hasRoute(routeName)) {
                    router.addRoute(route)
                }
            })
        }

        setRoutes(asyncRoutes)
    }

    const getPermissionRoles = (payload) => {
        localStorage.setItem('role', payload.roleName)
        setRoles(payload)
    }

    return {
        // state
        roles,
        permissions,
        accessRoutes,
        routes,
        authedRoutes,

        // actions
        setRoles,
        setAccessRoutes,
        setRoutes,
        setAuthedRoutes,
        setPermissions,
        getPermissionRoutes,
        getPermissions,
        getRoutes,
        getPermissionRoles
    }
}, {
    persistent: true,
})
