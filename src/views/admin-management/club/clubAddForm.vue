<script setup lang="ts">
import { ref, computed } from "vue";
import { clubAddFormRules } from "./rule";
import { clubFormProps } from "./types";
import useStore from "@/store";

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

const options = computed(() => useStore.departmentStore.getOptions());

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="clubAddFormRules">
    <el-row :gutter="32">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="名称" prop="club_name">
          <el-input
            v-model="newFormInline.club_name"
            placeholder="请输入基地/社团名称"
          ></el-input>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="学院" prop="department_id">
          <el-select v-model="newFormInline.department_id" placeholder="请选择学院名称">
            <el-option
              v-for="item in options"
              :label="item.fullName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped></style>
