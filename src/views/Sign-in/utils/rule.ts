import { reactive } from "vue";
import type { FormRules } from "element-plus";
import useStore from "@/store";
import formatUtil from "@/utils/formatter"

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  customTime: [{
    required: false,
    trigger: "blur",
    validator: (rule, value, callback) => {
      if (useStore.useRegistrationStore.getSwitchStatus() === "custom") {
        if (value === "") {
          callback(new Error("当前自定义时间不能为空"))
        } else if (formatUtil.isPass(useStore.useRegistrationStore.getCurrentCheckInTime(), value)) {
          callback(new Error("签退时间不能小于签到时间"))
        } else if (formatUtil.isSameTime(useStore.useRegistrationStore.getCurrentCheckInTime(),value)) {
          callback(new Error("签退时间不能与签到时间相同"))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
  }],
});