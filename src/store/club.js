import { defineStore } from 'pinia';
import { reactive } from 'vue'
import { getClub, setClub, removeClub } from '../utils/auth';
import memberApi from "@/api/member"
import baseApi from "@/api/base"
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
        currentRole: "", // 当前角色分为 超级管理员、成员、负责人、一般用户
    })

    function findOptionRole(option) {
        return state.clubOptions.findIndex(item => item.club_id === option?.club_id);
    }

    function isAvailable() {
        const roles = useStore.userStore.getRoles;
        // 检查当前账号的角色是否达成任一条件：是社团成员；是社团负责人； 是超级管理员 
        state.roleSuperAdmin = roles.is_super_admin;
        state.roleClubMember = roles.is_club_member || roles.is_club_manager;
    }

    function isOptionsExist(obj) {
        return state.clubOptions.some(item => item.club_id === obj?.club_id)
    }

    function isOptionsListEmpty() {
        return state.clubOptions.length === 0 || state.clubOptions.length === null;
    }

    const getCurrentRole = () => {
        return state.currentRole
    }

    const setCurrentRole = (val) => {
        state.currentRole = val;
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
        return new Promise((resolve, reject) => {
            baseApi.getBaseInfo({
                department_id: 0,
                club_name: "",
                page_num: 1,
                page_size: 9999
            })
                .then((data) => {
                    data.records.forEach(item => {
                        if (item.is_deleted) return; // 社团已删除
                        state.clubOptions.push({
                            club_name: item.name,
                            club_id: item.id,
                            department_name: item.department_name,
                            role: "超级管理员"
                        })
                        resolve(data)
                    });
                })
                .catch((err) => { reject(err) })
                .finally((data) => { reject(data) })
        })
    }

    const getMyClubOptionList = () => {
        // 获取自己所有所在社团的身份
        return new Promise((resolve, reject) => {
            memberApi.getMyClubList()
                .then((data) => {
                    state.clubOptions = data;
                    resolve(data)
                })
                .catch((err) => { reject(err) })
                .finally((data) => { reject(data) })
        })
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
        findOptionRole,
        isAvailable,
        isOptionsExist,
        isOptionsListEmpty,
        getCurrentRole,
        setCurrentRole,
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
        getMyClubOptionList,
    }
}, {
    persistent: true,
});

