<script setup lang="ts">
import { ref } from "vue";
import DutyList from "./duty/duty-list.vue";
import GroupList from "./group/group-list.vue";

const selected = ref("0");

</script>

<template>
  <div class="main">
    <el-tabs v-model="selected" class="duty">
      <el-tab-pane  name="0">
        <template #label>
          <span>值日表</span>
        </template>
      </el-tab-pane>
      <el-tab-pane  name="1">
        <template #label>
          <span>值日小组</span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <DutyList v-if="selected == '0'" />
    <GroupList v-if="selected == '1'" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__nav-wrap)::after {
  height: 1px;
}

:deep(.el-tabs__header) {
  margin-top: 10px;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

:deep(.el-tabs__nav-next.is-disabled),
:deep(.el-tabs__nav-prev.is-disabled) {
  opacity: 0.5;
}
</style>
