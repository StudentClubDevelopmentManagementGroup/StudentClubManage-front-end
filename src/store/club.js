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
        memberInfo: { user_id: "" },
        roleSuperAdmin: false,
        roleClubMember: false,
    })

    function isAvailable() {
        const roles = useStore.userStore.getRoles;
        // 检查当前账号的角色是否达成任一条件：是社团成员；是社团负责人； 是超级管理员 
        state.roleSuperAdmin = roles.is_super_admin;
        state.roleClubMember = roles.is_club_member || roles.is_club_manager;
    }

    function isOptionsExist(obj) {
        return state.clubOptions.some(item => item.club_id === obj.club_id)
    }

    function isOptionsListEmpty() {
        return state.clubOptions.length === 0 || state.clubOptions.length === null;
    }

    const getRoleClubMember = () => {
        return state.roleClubMember
    }

    const setRoleClubMember = (val) => {
        state.roleClubMember = val
    }

    const getRoleSuperAdmin = () => {
        return state.roleSuperAdmin
    }

    const setRoleSuperAdmin = (val) => {
        state.roleSuperAdmin = val
    }

    const clearOptionsList = () => {
        state.clubOptions = []
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
                        removeClub()
                        if (!state.roleSuperAdmin) {
                            message("用户未加入任何社团，如有疑问请联系管理员处理！", { type: "warning" });
                        }
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
        if (!isOptionsExist(val)) {
            state.clubOptions.push(val)
        }
        setClub(val)
        state.currentClub = val
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
        isAvailable,
        isOptionsExist,
        isOptionsListEmpty,
        getRoleClubMember,
        setRoleClubMember,
        getRoleSuperAdmin,
        setRoleSuperAdmin,
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

