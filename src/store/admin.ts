import { defineStore } from 'pinia';
import { reactive, computed } from 'vue'
import { message } from "@/utils/message";
import { adminPageRoutes } from "@/router"

interface Routes {
    icon: string,
    name: string,
    path: string,
    component: string,
    meta: {
        title: string,
        icon: string,
        hidden: boolean,
        alwaysShow: boolean,
        noCache: boolean,
        affix: boolean,
        breadcrumb: boolean,
        activeMenu: string,
        roles: string[]
    }
    children: Routes[]
}

export const useAdminStore = defineStore('admin', () => {
    const state = reactive({
        // 超级管理员用户操作相关参数
        defaultPwd: "Guet@123",
        pwd: "",
        radioStatus: true,
        routes: adminPageRoutes,
    })

    const getRoutes = () => {
        return state.routes
    }

    const setRoutes = (val: Routes) => {

    }

    const getDefaultPwd = () => {
        return state.defaultPwd
    }

    const setDefaultPwd = (val: string) => {
        state.defaultPwd = val
    }

    const getPwd = () => {
        return state.pwd
    }

    const setPwd = (val: string) => {
        state.pwd = val
    }

    const getRadioStatus = () => {
        return state.radioStatus
    }

    const setRadioStatus = (val: boolean) => {
        state.radioStatus = val
    }

    return {
        getRoutes,
        setRoutes,
        getDefaultPwd,
        setDefaultPwd,
        setPwd,
        getPwd,
        setRadioStatus,
        getRadioStatus,
    }
});

