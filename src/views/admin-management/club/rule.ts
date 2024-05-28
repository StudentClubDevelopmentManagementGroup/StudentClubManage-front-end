import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const clubAddFormRules = reactive(<FormRules>{
    club_name: [{
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