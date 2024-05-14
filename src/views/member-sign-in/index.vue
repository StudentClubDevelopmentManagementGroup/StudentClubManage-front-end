<script setup>
import {} from "vue";
import { PureTableBar } from "@/components/PureTableBar";
import useColumns from "./hook";

import {
  CirclePlus,
  Search,
  Refresh,
  Download,
  Cellphone,
} from "@element-plus/icons-vue";

const {
  formRef,
  tableRef,
  tableData,
  searchStatus,
  checkStatus,
  tableLoading,
  btnLoading,
  durationTime,
  pagination,
  query,
  shortcuts,
  columns,
  loadingConfig,
  getDataParams,

  fetchTableData,
  refreshTabaleData,
  addTableData,
  onSizeChange,
  onCurrentChange,
  getCheckStatus,
  checkIn,
  checkOut,
  reCheckIn,
  handleSearch,
  handleReset,
  handleAdd,
  handleExport,
  handleCheck,
  isMoreThanNDays,
} = useColumns();

const handleTimeChange = (val) => {
  // console.log("TimeChange", val);
};
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
      <el-form-item class="items-center pr-8" label="日期范围" prop="selectedTime">
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
        <el-popover :width="360" class="pr-4" placement="bottom" trigger="click">
          <template #reference>
            <el-button v-ripple type="success" :icon="Cellphone">签到</el-button>
          </template>

          <template #default>
            <div class="card flex items-center justify-center">
              <el-progress
                style="transition: var(--pure-transition-duration)"
                type="circle"
                :percentage="100"
                :status="checkStatus"
              >
                <div class="mb-2">
                  {{ checkStatus === "success" ? "已签到" : "待签到" }}
                </div>
                <el-button
                  class="!w-[75px] !h-[75px] !text-2xl"
                  @click="handleCheck"
                  v-ripple
                  :type="checkStatus === 'success' ? 'success' : 'danger'"
                  circle
                  >{{ checkStatus === "success" ? "签退" : "签到" }}</el-button
                >
              </el-progress>
            </div>
          </template>
        </el-popover>

        <el-button v-ripple type="primary" :icon="CirclePlus" @click="addTableData"
          >新增</el-button
        >
        <el-skeleton class="pl-4 leading-8" animated :loading="tableLoading">
          <template #template>
            <el-skeleton-item variant="text" class="!w-[100px]" />
          </template>
          <template #default>
            <div class="pl-4 flex transition-all leading-8">
              <div class="pr-1">打卡有效时长：</div>
              <div class="font-semibold">{{ durationTime }}</div>
            </div>
          </template>
        </el-skeleton>
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
// popper弹出框
.card {
  ::v-deep(.el-progress-circle) {
    width: 300px !important;
    height: 300px !important;
  }
  ::v-deep(.el-progress__text) {
    font-size: 48px !important;
  }
}
</style>
