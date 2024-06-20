<script setup lang="ts">
import { ref, reactive } from "vue";
import ClubSelection from "@/components/ClubSelection/index.vue";

import ReCol from "@/components/ReCol";

const ruleFormRef = ref();

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef">
    <el-row :gutter="32">
      <re-col class="!py-4">
        <ClubSelection :status="false" />
      </re-col>
    </el-row>
  </el-form>
</template>
