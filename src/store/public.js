import { defineStore } from 'pinia';
import { reactive, computed } from 'vue'
import { message } from "@/utils/message";


export const usePublicStore = defineStore('public', () => {
    const state = reactive({
        defaultPwd: "Guet@123",
        pwd: "",
        radioStatus: true,
    })

    const getDefaultPwd = () => {
        return state.defaultPwd
    }

    const setDefaultPwd = (val) => {
        state.defaultPwd = val
    }

    const getPwd = () => {
        return state.pwd
    }

    const setPwd = (val) => {
        state.pwd = val
    }

    const getRadioStatus = () => {
        return state.radioStatus
    }

    const setRadioStatus = (val) => {
        state.radioStatus = val
    }

    return {
        getDefaultPwd,
        setDefaultPwd,
        setPwd,
        getPwd,
        setRadioStatus,
        getRadioStatus,
    }
}, {
    persistent: true,
});

