<script setup>
import { ref } from "vue";
import { PureTableBar } from "@/components/PureTableBar";
import { message } from "@/utils/message";
import useColumns from "./utils/hook";

import { CirclePlus, Search, Refresh, Download } from "@element-plus/icons-vue";

const {
  formRef,
  tableRef,
  tableData,
  searchStatus,
  checkStatus,
  tableLoading,
  btnLoading,
  selectValue,
  options,
  pagination,
  query,
  shortcuts,
  columns,
  loadingConfig,
  getDataParams,

  onLoading,
  fetchTableData,
  refreshTabaleData,
  onSizeChange,
  onCurrentChange,
  checkOut,
  handleSearch,
  handleReset,
  handleAdd,
  handleExport,
  isMoreThanNDays,
  openDialog,
} = useColumns();

const handleTimeChange = (val) => {
  // console.log("TimeChange", val);
};

const handleForce2Checkout = () => {
  // TODO: 无效功能
  message(`"强制签退"是未完成功能`, { type: "error" });
};

const handleSelectionChange = (val) => {
  onLoading();
  fetchTableData();
};
</script>

<template>
  <div class="main">
    <!-- 检索栏 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="query"
      class="search-form bg-bg_color w-[99/100] shadow p-4 mb-8 overflow-auto"
    >
      <el-form-item class="items-center pr-8" label="姓名" prop="name">
        <el-input
          v-model="query.name"
          placeholder="请输入姓名"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item class="items-center pr-8" label="学号" prop="userId">
        <el-input
          v-model="query.userId"
          placeholder="请输入学号"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item class="items-center pr-8" label="时间范围" prop="selectedTime">
        <!-- 时间选择器 -->
        <el-date-picker
          v-model="query.selectedTime"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          :clearable="false"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          :popper-options="{
            placement: 'bottom-start',
          }"
          @change="handleTimeChange"
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
        <div class="pl-4 flex transition-all leading-8 w-fit">
          <div class="w-[120px]">切换当前查询：</div>
          <!-- <div class="font-semibold">{{}}</div> -->
          <el-select
            v-model="selectValue"
            class="!w-[150px]"
            placeholder="请选择当前查询"
            @change="handleSelectionChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
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
          <template #operation="{ row }">
            <el-popover
              placement="bottom"
              :width="210"
              v-if="row.isDeleted"
              :disabled="!isMoreThanNDays(row.checkInTime, 7)"
              trigger="hover"
              content="超过7天，请联系管理员补签"
            >
              <template #reference>
                <div>
                  <el-popconfirm title="是否补签到？" @confirm="reCheckIn(row)">
                    <template #reference>
                      <el-button
                        v-if="row.isDeleted"
                        :disabled="isMoreThanNDays(row.checkInTime, 7)"
                        class="!text-base reset-margin"
                        type="primary"
                        :size="size"
                        text
                      >
                        补签
                      </el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-popover>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
.main {
  ::v-deep(.no-display) {
    // 修改PureTableBar添加的类名
    display: none !important;
  }
}
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
}
</style>
