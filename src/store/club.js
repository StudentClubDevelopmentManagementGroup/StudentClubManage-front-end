import { defineStore } from 'pinia';
import { reactive, computed } from 'vue'

export const useClubStore = defineStore('club', () => {
    const state = reactive({
        clubName: "408", //TODO: 3.0开发进程获取 
        checkboxStatus: false,
        deleteState: 1,
    })

    const getDeleteState = () => {
        return state.deleteState
    }

    const setDeleteState = (val) => {
        state.deleteState = val
    }

    const getCheckboxStatus = () => {
        return state.checkboxStatus
    }

    const setCheckboxStatus = (val) => {
        state.checkboxStatus = val
    }

    const getClubName = computed(() => state.clubName)

    const setClubName = (val) => {
        state.clubName = val;
    }

    return {
        getClubName,
        setClubName,
        getCheckboxStatus,
        setCheckboxStatus,
        getDeleteState,
        setDeleteState,
    }
}, {
    persistent: true,
});

