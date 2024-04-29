<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { CirclePlus, Search, Refresh, Download } from "@element-plus/icons-vue";
import { PureTableBar } from "@/components/PureTableBar";
import useColumns from "./hook";
import useStore from "@/store";

const {
  tableData,
  userInfo,
  searchStatus,
  checkStatus,
  loading,
  pagination,
  shortcuts,
  searchInput,
  columns,
  adaptiveConfig,
  loadingConfig,
  getDataParams,

  fetchTableData,
  refreshTabaleData,
  addTableData,
  exportExcel,
  onSizeChange,
  onCurrentChange,
  handleSearch,
  handleReset,
} = useColumns();

// 切换角色选择框与方法
const selectValue = ref("当前视角：社团负责人");
const handleSelectChange = () => {
  useStore.useRegistrationStore.setRolePage(selectValue.value);
};
</script>

<template>
  <div>
    <div id="container">
      <!-- 检索栏 -->
      <div class="grid1">
        <el-card>
          <template #header>
            <div class="card-header">
              <div>切换角色：</div>
              <div style="margin-left: 5px">
                <el-select
                  v-model="selectValue"
                  @change="handleSelectChange"
                  style="width: 200px"
                >
                  <el-option label="成员" :value="1"></el-option>
                  <el-option label="社团负责人" :value="2"></el-option>
                </el-select>
              </div>
            </div>
          </template>
          <div class="card-body">
            <!-- 标签与输入框 -->
            <div class="inputer">
              <div class="input-label">姓名：</div>
              <el-input
                v-model="searchInput.name"
                class="!w-[240px]"
                size="large"
                placeholder="输入姓名"
              ></el-input>
              <div class="input-label">学号：</div>
              <el-input
                v-model="searchInput.userId"
                class="!w-[240px]"
                size="large"
                placeholder="输入学号"
              ></el-input>
              <div class="input-label">日期范围：</div>
              <!-- 时间选择器 -->
              <el-date-picker
                v-model="searchInput.time"
                type="daterange"
                class="!w-[300px]"
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
            </div>
            <!-- 按钮 -->
            <div class="operation">
              <el-button v-ripple type="primary" :icon="Search" @click="handleSearch"
                >查询</el-button
              >
              <el-button :icon="Refresh" v-ripple @click="handleReset">重置</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <!-- 表格 -->
      <div class="grid2">
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
                <!-- TODO: 社团负责人帮助补签的按钮另设 -->
                <el-button v-if="row.isDeleted" type="primary" text>补签</el-button>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid1 {
  .card-header {
    display: flex;
    align-items: center;
  }
  :deep() .el-card__header {
    width: 80%;
    color: #000;
    font-size: large;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  .card-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.card-body {
  .inputer {
    display: flex;
    align-items: center;
  }
  .input-label:not(:first-child) {
    color: #000;
    font-size: medium;
    font-weight: 400;

    margin-left: 20px;
  }
}
.grid2 {
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
