<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "../util/rule";
import { GroupFormProps } from "./hook.tsx";

const props = withDefaults(defineProps<GroupFormProps>(), {
  formInline: () => ({
    number: "",
    area: "",
    date_time: "",
    arranger_id: "",
    cleaner_id: "",
    club_id: 1,
    is_mixed: true,
    group_name: "",
  }),
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="房间号" prop="number">
      <el-input
        v-model="newFormInline.number"
        clearable
        placeholder="请输入房间号"
      />
    </el-form-item>
    <el-form-item label="打扫面积" prop="area">
      <el-input
        v-model="newFormInline.area"
        clearable
        placeholder="请输入打扫面积"
      >
        <template #append> m² </template></el-input
      >
    </el-form-item>
    <el-form-item label="打扫时间" prop="date_time">
      <el-date-picker
        v-model="newFormInline.date_time"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>
    <el-form-item label="小组名称" prop="group_name">
      <el-input
        disabled
        v-model="newFormInline.group_name"
        clearable
        placeholder="请输入成员学号"
      />
    </el-form-item>
    <el-form-item label="合室">
      <el-checkbox
        v-model="newFormInline.is_mixed"
        label="是否为合室"
        size="large"
        border
      />
    </el-form-item>
  </el-form>
</template>
