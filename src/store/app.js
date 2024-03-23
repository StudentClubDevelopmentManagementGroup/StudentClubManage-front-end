import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const appStore = defineStore('app', () => {

    const state = reactive({
        isCollapse: false
    })

    const setRow = (value) => {
        state.row = value;
    }

    return {
        state,
        setRow
    }
})