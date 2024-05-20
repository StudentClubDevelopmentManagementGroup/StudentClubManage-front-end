<script setup lang="ts">
import { ref } from "vue";
import { departmentAddRules } from "./utils/rule";
import { userProps } from "./utils/types";

import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<userProps>(), {
  formInline: () => ({}),
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="departmentAddRules">
    <el-row :gutter="32">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="学院全称" prop="">
          <!-- <el-input
            v-model="newFormInline.fullName"
            placeholder="请输入学院全称"
          ></el-input> -->
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="学院简称" prop="">
          <!-- <el-input
            v-model="newFormInline.abbreviation"
            placeholder="请输入学院简称"
          ></el-input> -->
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped></style>
