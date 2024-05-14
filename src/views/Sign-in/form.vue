<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import useStore from "@/store";

import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    customTime: "",
  }),
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const checkInTime = computed(() => useStore.useRegistrationStore.getCurrentCheckInTime());
const afterPlusCheckInTime = computed(() =>
  useStore.useRegistrationStore.getAfterPlusCheckInTime()
);

const loading = ref(false);
const disabled = ref(false);
const type = ref("primary");
const switchStatus = ref("now"); // now: 表示当前时间，custom：表示自定义选择时间

const makeRange = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

// TODO: 限制可选择的时间范围逻辑待做，当前通过表单校验限制
const disabledHours = () => {
  return [];
};
const disabledMinutes = (hour: number) => {
  // if (hour === 17) {
  //   return makeRange(0, 29);
  // }
  // if (hour === 18) {
  //   return makeRange(31, 59);
  // }
  return [];
};
const disabledSeconds = (hour: number, minute: number) => {
  // if (hour === 18 && minute === 30) {
  //   return makeRange(1, 59);
  // }
  return [];
};

const handleTimeChange = (val) => {
  newFormInline.value.customTime = val ? val : "";
};

const handleRadioChange = (val) => {
  useStore.useRegistrationStore.setSwitchStatus(val);
  if (val === "custom") {
    // 自定义时间
    type.value = "info";
    disabled.value = true;
  } else if (val === "now") {
    // 签到+4小时
    type.value = "primary";
    disabled.value = false;
  }
};

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules" label-width="82px">
    <el-row :gutter="32">
      <re-col>
        <el-form-item label="选择时间" prop="switchStatus">
          <el-radio-group v-model="switchStatus" @change="handleRadioChange">
            <el-radio value="now" border>签到后4小时</el-radio>
            <el-radio value="custom" border>自定义补签时间</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="签到时间">
          <el-text class="mx-1" size="large" tag="b" :type="type">{{
            checkInTime.slice(11, 19)
          }}</el-text>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="补签时间" prop="nowTime">
          <el-text class="mx-1" size="large" tag="b" :type="type">{{
            afterPlusCheckInTime.slice(11, 19)
          }}</el-text>
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="选择时间" prop="customTime">
          <el-time-picker
            v-model="newFormInline.customTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="HH:mm:ss"
            :disabled="!disabled"
            placeholder="请选择时间"
            @change="handleTimeChange"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
.refresh-button {
  ::v-deep(i) {
    height: fit-content;
    width: fit-content;
  }
  ::v-deep(svg) {
    height: 20px;
    width: 20px;
  }
  :hover {
    background: transparent;
  }
}
</style>
