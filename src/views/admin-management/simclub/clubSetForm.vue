<script setup lang="ts">
import { ref } from "vue";
import { clubSetFormRules } from "./rule";
import { clubFormProps } from "./types";

import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<clubFormProps>(), {
  formInline: () => ({
    club_name: "",
    department_id: "",
    user_id: "",
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
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="clubSetFormRules">
    <el-row :gutter="32">
      <re-col>
        <el-form-item label="学院" prop="user_id">
          <el-input
            v-model="newFormInline.user_id"
            placeholder="请输入负责人工号"
          ></el-input>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped></style>
