import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const layoutStore = defineStore('app', () => {

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