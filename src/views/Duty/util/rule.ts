import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  number: [{ required: true, message: "房间号为必填项", trigger: "blur" }],
  area: [{ required: true, message: "面积为必填项", trigger: "blur" }],
  date_time: [{ required: true, message: "打扫时间为必填项", trigger: "blur" }],
  cleaner_id: [{ required: true, message: "成员学号为必填项", trigger: "blur" }],
});
