import { defineStore } from 'pinia';
import { reactive, ref } from 'vue'
import formatUtil from "@/utils/formatter";

export const useRegistrationStore = defineStore('registration', () => {
    const state = reactive({
        currentUserId: "",
        currentCheckInTime: "",
        afterPlusCheckInTime: "",
        switchStatus: "now", // now: 表示当前时间，custom：表示自定义选择时间
    })

    const setCurrentUserId = (val) => {
        state.currentUserId = val
    }

    const getCurrentUserId = () => {
        return state.currentUserId
    }

    const setCurrentCheckInTime = (val) => {
        state.currentCheckInTime = val
        setAfterPlusCheckInTime(formatUtil.plusHours(val, 4))
    }

    const getCurrentCheckInTime = () => {
        return state.currentCheckInTime;
    }

    const setAfterPlusCheckInTime = (val) => {
        state.afterPlusCheckInTime = val
    }

    const getAfterPlusCheckInTime = () => {
        return state.afterPlusCheckInTime;
    }

    const setSwitchStatus = (val) => {
        state.switchStatus = val
    }

    const getSwitchStatus = () => {
        return state.switchStatus;
    }


    return {
        setCurrentUserId,
        getCurrentUserId,
        setCurrentCheckInTime,
        getCurrentCheckInTime,
        setAfterPlusCheckInTime,
        getAfterPlusCheckInTime,
        setSwitchStatus,
        getSwitchStatus
    }
}, {
    persistent: true,
});

