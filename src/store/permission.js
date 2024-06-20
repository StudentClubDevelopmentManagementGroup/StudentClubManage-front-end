import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router, { constantRoutes, asyncRoutes } from '@/router'
import { useClubStore } from "@/store/club"
import { useUserStore } from "@/store/user"
import constants from "@/config";

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
        let newAuthedRoutes = []
        if (useUserStore().getRoles.is_super_admin) {
            newAuthedRoutes = constants.superAdmin
        } else if (useClubStore().getCurrentRole() === "基地负责人") {
            newAuthedRoutes = constants.admin
        } else if (useClubStore().getCurrentRole() === "成员") {
            newAuthedRoutes = constants.member
        } else {
            newAuthedRoutes = JSON.parse(localStorage.getItem('authedRoutes'))
        }

        if (!newAuthedRoutes) return
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

    const removeRoutes = () => {
        localStorage.removeItem("authedRoutes")
    }

    const getRoutes = () => {
        const storedAuthedRoutes = localStorage.getItem('authedRoutes')

        if (storedAuthedRoutes !== 'undefined') {
            const parsedAuthedRoutes = JSON.parse(storedAuthedRoutes)
            if (!parsedAuthedRoutes || parsedAuthedRoutes.indexOf('undefined') !== -1) {
                return
            }
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

    const getFirstRoute = computed(() => {
        return authedRoutes.value[0]
    })

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
        removeRoutes,
        authedRoutes,
        setRoles,
        setAccessRoutes,
        setRoutes,
        setAuthedRoutes,
        setPermissions,
        getPermissionRoutes,
        getPermissions,
        getRoutes,
        getPermissionRoles,
        getFirstRoute
    }
}, {
    persistent: true,
})
