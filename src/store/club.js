import { defineStore } from 'pinia';
import { reactive, watch, computed } from 'vue'
import memberApi from "@/api/member"

export const useClubStore = defineStore('club', () => {
    const state = reactive({
        clubName: "408", //TODO: 3.0开发进程获取 
        checkboxStatus: false,
        deleteState: 1,
        currentClub: { clubName: "408", club_id: 1 },
        clubOptions: []
    })

    watch(state.currentClub, (newValue, oldValue) => {
        //TODO: 等到确认getCurrentClub().clubName是否会影响computed值计算后再移除
        state.clubName = newValue.clubName
    })

    function isOptionsExist(obj) {
        return state.clubOptions.some(item => item.club_id === obj.club_id)
    }

    function isOptionsListEmpty() {
        return state.clubOptions.length === 0 || state.clubOptions.length === null;
    }

    const getClubOptions = () => {
        return state.clubOptions
    }

    const getClubOptionsList = (memberInfo) => {
        //TODO: 获取当前社团成员所属的所有社团列表
        return new Promise((resolve, reject) => {
            // memberApi.getClubList()
            //     .then((data) => {
            //         console.log("data", data)
            //     }).catch((error) => {
            //         console.warn(error.message)
            //     })
        });
    }

    const getCurrentClub = () => {
        return state.currentClub
    }

    const setCurrentClub = (val) => {
        state.currentClub = val
        if (!isOptionsExist(val)) {
            state.clubOptions.push(val)
        }
    }

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

    const getClubName = () => {
        return state.clubName
    }

    const setClubName = (val) => {
        state.clubName = val;
    }

    return {
        isOptionsExist,
        isOptionsListEmpty,
        getClubName,
        setClubName,
        getCheckboxStatus,
        setCheckboxStatus,
        getDeleteState,
        setDeleteState,
        getCurrentClub,
        setCurrentClub,
        getClubOptions,
        getClubOptionsList,
    }
}, {
    persistent: true,
});

