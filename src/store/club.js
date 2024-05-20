import { defineStore } from 'pinia';
import { reactive } from 'vue'
import { getClub, setClub, removeClub } from '../utils/auth';
import { message } from "@/utils/message";
import memberApi from "@/api/member"
import useStore from '@/store';

export const useClubStore = defineStore('club', () => {
    const state = reactive({
        checkboxStatus: false,
        deleteState: 1,
        currentClub: getClub(),
        clubOptions: [],
        memberInfo: { userId: "" }
    })

    function isOptionsExist(obj) {
        return state.clubOptions.some(item => item.clubId === obj.clubId)
    }

    function isOptionsListEmpty() {
        return state.clubOptions.length === 0 || state.clubOptions.length === null;
    }

    const getClubOptions = () => {
        return state.clubOptions
    }

    const getClubOptionsList = () => {
        if (state.memberInfo.userId === "") {
            state.memberInfo.userId = useStore.userStore.getUserInfo.user_id
        }
        // 获取当前社团成员所属的所有社团列表
        return new Promise((resolve, reject) => {
            memberApi.getClubList(state.memberInfo)
                .then((data) => {
                    state.clubOptions = data;
                }).catch((error) => {
                    console.warn(error.message)
                })
        });
    }

    const getCurrentClub = () => {
        return state.currentClub
    }

    const setCurrentClub = (val) => {
        setClub(val)
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

    return {
        isOptionsExist,
        isOptionsListEmpty,
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

