import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const baseStore = defineStore('base', () => {

    const state = reactive({
        row: {}
    })

    const setRow = (value) => {
        state.row = value;
    }

    return {
        state,
        setRow
    }
})