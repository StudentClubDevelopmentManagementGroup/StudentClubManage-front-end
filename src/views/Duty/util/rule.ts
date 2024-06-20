import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  number: [{ required: true, message: "房间号为必填项", trigger: "blur" }],
  area: [{ required: true, message: "面积为必填项", trigger: "blur" }],
  date_time: [{ required: true, message: "打扫时间为必填项", trigger: "blur" }],
  cleaner_id: [{ required: true, message: "成员学号为必填项", trigger: "blur" }],
});

export const addFormRules = reactive(<FormRules>{
  member_id: [{ required: true, message: "成员学号为必填项", trigger: "blur" }],
  group_name: [{ required: true, message: "组名为必填项", trigger: "blur" }],
});