<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import useStore from "@/store";

const ruleFormRef = ref();

const checked = ref(false);
const state = computed(() => useStore.useDepartmentStore.getDeleteState());

const handleCheckboxChange = (val) => {
  useStore.useDepartmentStore.setCheckboxStatus(val);
};

onMounted(() => {
  useStore.useDepartmentStore.setCheckboxStatus(false);
  useStore.useDepartmentStore.setDeleteState(1);
});

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" class="text-center">
    <div v-if="state === 1">
      <el-result
        class="!p-4"
        icon="warning"
        title="你正在进行风险操作！"
        sub-title="删除学院将会导致与其相关的数据全部丢失并不可恢复！"
      />
      <el-checkbox v-model="checked" size="large" @change="handleCheckboxChange">
        我已知晓风险并同意
      </el-checkbox>
    </div>
    <div v-if="state === 2">
      <el-result
        class="!p-4"
        icon="warning"
        title="删除学院将会导致与其相关的数据全部丢失并不可恢复！"
        sub-title="请再次确认"
      />
    </div>
  </el-form>
</template>

<style lang="scss" scoped>
.el-form {
  ::v-deep(.el-result__subtitle p) {
    color: black;
    font-weight: 600;
    font-size: large;
  }
  .description {
    color: black;
    font-weight: 600;
    font-size: large;
  }
}
</style>
