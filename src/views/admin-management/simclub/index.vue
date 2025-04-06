<!-- index.vue -->
<script setup>
import { onMounted, computed } from "vue";
import { PureTableBar } from "@/components/PureTableBar";
import { delay } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { useRouter } from "vue-router";
import { useClubColumns } from "./hook";
import useStore from "@/store";

const {
  tableRef,
  tableData,
  tableLoading,
  pagination,
  columns,
  loadingConfig,

  fetchTableData,
  onLoading,
  onSizeChange,
  onCurrentChange,
  toggleRecruitment,
  openDialog,
  setManager,
} = useClubColumns();

const router = useRouter();


onMounted(() => {
  onLoading();
  fetchTableData();
});
</script>

<template>
  <div>
    <!-- 移除检索栏 -->
    
    <!-- 表格 -->
    <PureTableBar class="shadow" :columns="columns">
      <template #default="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          row-key="id"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="tableLoading"
          :size="size"
          border
          :data="tableData"
          :loading-config="loadingConfig"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)',
          }"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <div>
              <el-button
                type="primary"
                :size="size"
                @click="openDialog('设置教师负责人', row)"
                text
                >设置负责人</el-button
              >
              <el-button type="warning" :size="size" @click="toggleRecruitment(row)" text>
                {{ row.state ? '开放招新' : '停止招新' }}
              </el-button>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
.pure-table {
  ::v-deep(.cell-selection .cell) {
    justify-content: center;
  }
}
</style>
