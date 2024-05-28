import { reactive } from "vue";
import type { FormRules } from "element-plus";

const REGEXP_PWD = [
    /^.{4,18}$/, // 8-18字符之间
    /^[^\u4E00-\u9FA5]*$/, // 不包含汉字
    /(?=.*\d)/, // 至少包含一个数字
    /(?=.*[a-z])/, // 至少包含一个小写字母
    /(?=.*[A-Z])/, // 至少包含一个大写字母
    /(?=.*[!@#$%^&*()])/ // 至少包含一个特殊字符或括号
]

export const userUpdatePwdRules = reactive(<FormRules>{
    pwd: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!useStore.publicStore.getRadioStatus()) {
                if (!value) {
                    callback(new Error("密码不能为空"));
                } else if (!REGEXP_PWD[1].test(value)) {
                    callback(new Error("密码不应该包含汉字"))
                } else if (!REGEXP_PWD[0].test(value)) {
                    callback(new Error("密码的长度在4~16之间"));
                } else if (!REGEXP_PWD[2].test(value)) {
                    callback(new Error("密码应该至少包含一个数字"))
                } else if (!REGEXP_PWD[3].test(value)) {
                    callback(new Error("密码应该至少包含一个小写字母"))
                } else if (!REGEXP_PWD[4].test(value)) {
                    callback(new Error("密码应该至少包含一个大写字母"))
                } else if (!REGEXP_PWD[5].test(value)) {
                    callback(new Error("密码应该至少包含一个特殊符号或括号"))
                }
            }
            callback();
        },
    }],
    rePwd: [{
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
            if (!useStore.publicStore.getRadioStatus()) {
                if (!value) {
                    callback(new Error("不能为空"));
                } else if (value !== useStore.publicStore.getPwd()) {
                    callback(new Error("与新密码输入不一致"))
                }
            }
            callback()
        },
    }],
});