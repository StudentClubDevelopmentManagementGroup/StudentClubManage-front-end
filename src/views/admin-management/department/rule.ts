import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const departmentAddRules = reactive(<FormRules>{
    fullName: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入学院全称"))
            } else {
                callback();
            }
        },
    }],
    abbreviation: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入学院简称"))
            } else {
                callback();
            }
        },
    }],
});

export const departmentUpdateRules = reactive(<FormRules>{
    fullName: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入学院全称"))
            } else {
                callback();
            }
        },
    }],
});

export const departmentDeleteRules = reactive(<FormRules>{
    name: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入学院全称"))
            } else {
                callback();
            }
        },
    }],
});