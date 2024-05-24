<script setup lang="ts">
import { ref, computed } from "vue";
import { departmentUpdateRules } from "./utils/rule";
import { departmentProps } from "./utils/types";
import useStore from "@/store";

import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<departmentProps>(), {
  formInline: () => ({
    fullName: "",
    abbreviation: "",
  }),
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const options = computed(() => useStore.departmentStore.getOptions());

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="departmentUpdateRules">
    <el-row :gutter="32">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="学院全称" prop="fullName">
          <el-input
            v-model="newFormInline.fullName"
            placeholder="请输入学院全称"
          ></el-input>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped></style>
