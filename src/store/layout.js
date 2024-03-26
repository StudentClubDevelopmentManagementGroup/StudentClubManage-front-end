import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { adminManagementRoutes } from '@/routes/admin-management-model'

export const layoutStore = defineStore('app', () => {
    console.log("adminManagementRoutes", adminManagementRoutes)
    const state = reactive({
        isCollapse: true
    })

    const setRow = (value) => {
        state.row = value;
    }

    return {
        state,
        setRow
    }
})