import { defineStore } from 'pinia';
import { reactive } from 'vue'
import { getClub, setClub, removeClub } from '../utils/auth';
import { message } from "@/utils/message";
import { useRouter } from 'vue-router';
import memberApi from "@/api/member"
import useStore from '@/store';

export const useClubStore = defineStore('club', () => {
    const state = reactive({
        checkboxStatus: false,
        deleteState: 1,
        currentClub: getClub(),
        clubOptions: [],
        memberInfo: { user_id: "" }
    })

    function isOptionsExist(obj) {
        return state.clubOptions.some(item => item.clubId === obj.clubId)
    }

    function isOptionsListEmpty() {
        return state.clubOptions.length === 0 || state.clubOptions.length === null;
    }

    const clearOptionsList = () => {
        state.clubOptions = []
        removeClub()
    }

    const getClubOptions = () => {
        return state.clubOptions
    }

    const getClubOptionsList = () => {
        const router = useRouter()
        state.memberInfo.user_id = useStore.userStore.getUserInfo.user_id
        // 获取当前社团成员所属的所有社团列表
        return new Promise((resolve, reject) => {
            memberApi.getClubList(state.memberInfo)
                .then((data) => {
                    if (data === "" || data === "查无对象") {
                        clearOptionsList();
                        message("未加入任何社团，如有疑问请联系管理员处理", { type: "warning" });
                        router.push("/homepage");
                    } else {
                        state.clubOptions = data;
                    }
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
        clearOptionsList,
        getClubOptions,
        getClubOptionsList,
    }
}, {
    persistent: true,
});

