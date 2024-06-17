<script setup lang="ts">
import { onMounted, computed } from "vue";
import { PureTableBar } from "@/components/PureTableBar";
import { useUserColumns } from "./hook";
import { message } from "@/utils/message";
import { exportExcel } from "@/utils/export";
import useStore from "@/store";

import ReCol from "@/components/ReCol";

import { Search, Refresh, Download } from "@element-plus/icons-vue";

const {
  formRef,
  tableRef,
  tableData,
  searchStatus,
  tableLoading,
  btnLoading,
  pagination,
  query,
  columns,
  loadingConfig,
  getDataParams,

  fetchTableData,
  refreshTabaleData,
  onLoading,
  onSizeChange,
  onCurrentChange,
  handleSearch,
  handleReset,
  openDialog,
} = useUserColumns();

const options = computed(() => useStore.departmentStore.getOptions());

onMounted(() => {
  useStore.departmentStore.getOptionsList();
  onLoading();
  fetchTableData();
});
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
      <el-form-item class="items-center pr-8" label="用户ID" prop="user_id">
        <el-input
          v-model="query.user_id"
          style="width: 240px"
          placeholder="请输入用户学号/工号"
        />
      </el-form-item>

      <el-form-item class="items-center pr-8" label="用户名" prop="user_name">
        <el-input
          v-model="query.user_name"
          style="width: 240px"
          placeholder="请输入用户名"
        />
      </el-form-item>

      <el-form-item class="items-center pr-8" label="学院" prop="department_id">
        <el-select
          v-model="query.department_id"
          placeholder="请选择学院名称"
          class="!w-[240px]"
        >
          <el-option
            v-for="item in options"
            :label="item.fullName"
            :value="item.id"
          ></el-option>
        </el-select>
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
      <template #left> </template>

      <template #right>
        <el-button
          v-ripple
          type="primary"
          @click="exportExcel(columns, tableData, '用户管理')"
          :icon="Download"
        >
          导出
        </el-button>
      </template>

      <template #default="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          row-key="user_id"
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
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)',
          }"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
        >
          <template #role="{ row }">
            <el-tag v-if="row.role.is_club_manager" type="danger">负责人</el-tag>
            <el-tag v-else-if="row.role.is_club_member" class="ml-4" type="primary">
              普通成员
            </el-tag>
            <el-tag v-if="row.role.is_teacher" class="ml-4" type="success">教师</el-tag>
            <el-tag v-else class="ml-4" type="success">学生</el-tag>
          </template>
          <template #operation="{ row }">
            <div>
              <el-button type="primary" @click="openDialog('修改密码', row)">
                修改密码
              </el-button>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
// 检索容器
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
  .icon-btn {
    border: none;
    padding: 0px;
    ::v-deep(i) {
      width: fit-content;
      height: fit-content;
    }
    ::v-deep(svg) {
      width: 25px;
      height: 25px;
    }
  }
}
</style>
