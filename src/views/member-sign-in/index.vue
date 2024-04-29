<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { CirclePlus, Search, Refresh, Download } from "@element-plus/icons-vue";
import { PureTableBar } from "@/components/PureTableBar";
import useColumns from "./hook";

const {
  tableData,
  checkStatus,
  loading,
  pagination,
  searchInput,
  shortcuts,
  columns,
  adaptiveConfig,
  loadingConfig,

  refreshTabaleData,
  addTableData,
  exportExcel,
  onSizeChange,
  onCurrentChange,
  reCheckIn,
  handleCheck,
  handleSearch,
  handleReset,
} = useColumns();

const router = useRouter();
</script>

<template>
  <div>
    <div id="container">
      <div class="grid1">
        <!-- 检索栏 -->
        <el-card class="card1">
          <template #header>
            <div class="card-header">
              <div>检索</div>
            </div>
          </template>
          <el-form-item label="日期范围">
            <!-- 时间选择器 -->
            <el-date-picker
              v-model="searchInput.time"
              type="daterange"
              class="!w-[240px]"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="shortcuts"
              :popper-options="{
                placement: 'bottom-start',
              }"
              size="large"
            />
          </el-form-item>

          <el-form-item label="时长范围">
            <!-- TODO:无效功能，后端不提供时长查询参数，由于分页获取数据也无法前端处理 -->
            <div style="width: 100px">
              <el-input
                style="width: 50px; padding-right: 10px"
                v-model="searchInput.timeLong.hour"
                placeholder=""
              />
              <span>小时</span>
            </div>
            <div style="width: 100px">
              <el-input
                style="width: 50px; padding-right: 10px"
                v-model="searchInput.timeLong.minute"
                placeholder=""
              />
              <span>分钟</span>
            </div>
          </el-form-item>
          <template #footer>
            <el-form-item>
              <el-button v-ripple type="primary" :icon="Search" @click="handleSearch"
                >查询</el-button
              >
              <el-button :icon="Refresh" v-ripple @click="handleReset">重置</el-button>
            </el-form-item>
          </template>
        </el-card>
        <!-- 签到状态以及签到框 -->
        <el-card class="card2">
          <el-progress type="circle" :percentage="100" :status="checkStatus">
            <div class="el-progress__text-div">
              {{ checkStatus === "success" ? "已签到" : "待签到" }}
            </div>
            <el-button
              @click="handleCheck"
              v-ripple
              :type="checkStatus === 'success' ? 'success' : 'danger'"
              circle
              >{{ checkStatus === "success" ? "签退" : "签到" }}</el-button
            >
          </el-progress>
        </el-card>
      </div>
      <!-- 表格 -->
      <div class="grid3">
        <PureTableBar :columns="columns" @refresh="refreshTabaleData">
          <template #left>
            <el-button v-ripple type="primary" :icon="CirclePlus" @click="addTableData"
              >新增</el-button
            >
          </template>
          <template #right>
            <el-button v-ripple type="primary" @click="exportExcel" :icon="Download">
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
                <el-button v-if="row.isDeleted" type="primary" @click="reCheckIn" text
                  >补签</el-button
                >
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  .grid1 {
    padding-right: 20px;
    padding-bottom: 12px;
  }
}
.el-card {
  height: fit-content;
  :deep() .el-card__body {
    min-width: 360px;
  }
}
.card1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .card-header {
    display: flex;
    align-items: center;
  }
  .el-form-item {
    align-items: center;
  }
  :deep() .el-card__header {
    width: 80%;
    color: #000;
    font-size: large;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :deep() .el-card__footer {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :deep() .el-form-item__label {
    color: #000;
    font-size: medium;
    font-weight: 400;
  }
}
.card2 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 10px;

  :deep() .el-card__body {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  .el-progress {
    transition: var(--pure-transition-duration);
  }
  :deep() .el-progress-circle {
    width: 300px !important;
    height: 300px !important;
  }
  :deep() .el-progress__text {
    font-size: 48px !important;
  }
  .el-progress__text-div {
    transition: var(--pure-transition-duration);
    margin-bottom: 10px;
  }
  .el-button {
    font-size: 24px;
    width: 75px;
    height: 75px;
    transition: var(--pure-transition-duration);
  }
}
.grid3 {
  & > :deep() .mt-2 {
    margin-top: 0;
  }
  /* 修复未指定列的宽度，导致在界面展开/收起时发生的宽度异常，而破坏容器 */
  :deep() .el-table__body {
    width: 100% !important;
  }
  :deep() .el-scrollbar__view {
    width: 100%;
  }
  /* 修复未指定列的宽度，导致在界面展开/收起时发生的宽度异常，而破坏容器 */
}
</style>
