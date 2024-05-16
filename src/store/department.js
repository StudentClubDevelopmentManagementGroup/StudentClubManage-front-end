import { defineStore } from 'pinia';
import { reactive, computed } from 'vue'
import { message } from "@/utils/message";
import departmentApi from "@/api/department";


export const useDepartmentStore = defineStore('department', () => {
    const state = reactive({
        options: [{
            id: 0,
            fullName: "",
            abbreviation: "",
        }],
        checkboxStatus: false,
        deleteState: 1,
    })

    const getOptions = () => {
        return state.options
    }

    const getOptionsList = () => {
        return new Promise((resolve, reject) => {
            departmentApi
                .getAllDepartment()
                .then((data) => {
                    state.options = data;
                })
                .catch((error) => {
                    message("获取院系信息失败，请重新加载", { type: "error" });
                });
        });
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
        getOptions,
        getOptionsList,
        getCheckboxStatus,
        setCheckboxStatus,
        getDeleteState,
        setDeleteState,
    }
}, {
    persistent: true,
});

