<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./util/rule";
import { FormProps } from "./hook.tsx";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    userId: "",
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
    <el-form-item label="成员学号" prop="userId">
      <el-input
        v-model="newFormInline.userId"
        clearable
        placeholder="请输入成员学号"
      />
    </el-form-item>
  </el-form>
</template>
