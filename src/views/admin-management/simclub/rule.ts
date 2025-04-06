// rule.ts 保留设置负责人验证规则
import { reactive } from "vue";
import type { FormRules } from "element-plus";

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
