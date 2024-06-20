<script setup lang="ts">
import { ref } from "vue";
import { addFormRules } from "../util/rule";
import { FormProps } from "./hook.tsx";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    group_name: "",
    member_id: "",
    club_id: 1,
  }),
  isNowGroup: false,
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
    :rules="addFormRules"
    label-width="82px"
  >
    <el-form-item label="组名" prop="group_name">
      <el-input
        v-model="newFormInline.group_name"
        :disabled="isNowGroup"
        clearable
        placeholder="请输入新组名"
      />
    </el-form-item>
    <el-form-item label="组员学号" prop="member_id">
      <el-input
        v-model="newFormInline.member_id"
        clearable
        placeholder="请输入分组组员学号"
      />
    </el-form-item>
  </el-form>
</template>
