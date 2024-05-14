import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const clubAddFormRules = reactive(<FormRules>{
    name: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("名称不能为空"))
            } else {
                callback();
            }
        },
    }],
    department_id: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("请选择院系"))
            } else {
                callback();
            }
        },
    }]
});

export const clubSetFormRules = reactive(<FormRules>{
    user_id: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入工号"))
            } else {
                callback();
            }
        },
    }]
});

export const departmentAddRules = reactive(<FormRules>{
    fullName: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入学院名称"))
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