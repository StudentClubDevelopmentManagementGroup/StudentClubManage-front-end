<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { CirclePlus, Search, Refresh, Download } from "@element-plus/icons-vue";
import { PureTableBar } from "@/components/PureTableBar";
import useStore from "@/store";
import useColumns from "./hook";

const {
  tableData,
  userInfo,
  getTableDataParams,
  columns,
  pagination,
  loading,
  loadingConfig,
  adaptiveConfig,

  fetchTableData,
  addTableData,
  exportExcel,
  refreshTabaleData,
  onSizeChange,
  onCurrentChange,
} = useColumns();

const router = useRouter();
</script>

<template>
  <div id="container">
    <div class="grid1">
      <el-card>搜索栏占位符</el-card>
    </div>
    <div class="grid2">
      <el-card>签到状态占位符占位符</el-card>
    </div>
    <div class="grid3">
      <PureTableBar :columns="columns" @refresh="refreshTabaleData">
        <template #left>
          <el-button type="primary" :icon="CirclePlus" @click="addTableData"
            >新增</el-button
          >
        </template>
        <template #right>
          <el-button type="primary" @click="exportExcel" :icon="Download">
            导出
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            row-key="id"
            align-whole="center"
            table-layout="auto"
            border
            stripe
            adaptive
            :adaptiveConfig="adaptiveConfig"
            :size="size"
            :data="tableData"
            :loading="loading"
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
              <el-button v-if="row.deleted" type="primary" @click="" text>补签</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#container {
  height: calc(
    100% - 24px
  ); /* 自动添加的main-contianer样式的margin:24px，使height:100%破坏原有grow容器*/
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "top-left right"
    "bottom-left right";
  .grid1 {
    padding-right: 20px;
    padding-bottom: 12px;
    grid-area: top-left;
  }
  .grid2 {
    padding-right: 20px;
    padding-top: 12px;
    padding-bottom: 24px;
    grid-area: bottom-left;
  }
  .grid3 {
    grid-area: right;
  }
}
.el-card {
  height: 100%;
  :deep() .el-card__body {
    padding: 0;
    min-width: 360px;
  }
}
.grid3 {
  :deep() .mt-2 {
    margin-top: 0;
  }
  :deep() .pure-table {
    height: 100%;
  }
}
</style>
