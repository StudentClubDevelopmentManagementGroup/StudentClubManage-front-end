<script setup>
import {} from "vue";
import { PureTableBar } from "@/components/PureTableBar";
import { useDepartmentColumns } from "./utils/hook";

import { CirclePlus, Search, Refresh, Download, Delete } from "@element-plus/icons-vue";

const {
  formRef,
  tableRef,
  tableLoading,
  btnLoading,
  pagination,
  computeTableData,
  query,
  columns,
  loadingConfig,

  refreshTabaleData,
  onSizeChange,
  onCurrentChange,
  handleSearch,
  handleReset,
  handleExport,
  openDialog,
  openDeleteDialog,
} = useDepartmentColumns();
</script>

<template>
  <div>
    <!-- 检索栏 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="query"
      class="search-form bg-bg_color w-[99/100] shadow p-4 mb-8 overflow-auto"
    >
      <el-form-item class="items-center pr-8" label="学院全称" prop="fullName">
        <el-input
          v-model="query.fullName"
          style="width: 240px"
          placeholder="请输入学院全称"
        />
      </el-form-item>

      <el-form-item class="items-center pr-8" label="学院简称" prop="abbreviation">
        <el-input
          v-model="query.abbreviation"
          style="width: 240px"
          placeholder="请输入学院简称"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-ripple
          type="primary"
          :icon="Search"
          @click="handleSearch"
          :loading="btnLoading"
          >查询</el-button
        >
        <el-button :icon="Refresh" v-ripple @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <PureTableBar class="shadow" :columns="columns" @refresh="refreshTabaleData">
      <template #left>
        <el-button
          v-ripple
          type="primary"
          :icon="CirclePlus"
          @click="openDialog('新增学院')"
          >新增</el-button
        >
      </template>

      <template #right>
        <el-button v-ripple type="primary" @click="handleExport" :icon="Download">
          导出
        </el-button>
      </template>

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
          :data="computeTableData"
          :loading-config="loadingConfig"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
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
                type="danger"
                :size="size"
                :icon="Delete"
                @click="openDeleteDialog('删除学院', row, row)"
                >删除</el-button
              >
              <el-button
                type="success"
                :size="size"
                @click="openDialog('修改学院信息', row)"
                >编辑</el-button
              >
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  ::v-deep(.el-form-item) {
    margin: 0;
  }
}
// pure-table
.pure-table {
  ::v-deep(.cell-selection .cell) {
    justify-content: center; // 防止勾选项的表项由于宽度不足而位移
  }
}
</style>
