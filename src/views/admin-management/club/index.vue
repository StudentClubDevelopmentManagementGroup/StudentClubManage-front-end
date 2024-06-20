<script setup>
import { onMounted, computed } from "vue";
import { PureTableBar } from "@/components/PureTableBar";
import { delay } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { useRouter } from "vue-router";
import { useClubColumns } from "./hook";
import { exportExcel } from "@/utils/export";
import useStore from "@/store";

import { CirclePlus, Search, Refresh, Download, Delete } from "@element-plus/icons-vue";

const {
  formRef,
  tableRef,
  tableData,
  tableLoading,
  btnLoading,
  pagination,
  query,
  columns,
  loadingConfig,

  fetchTableData,
  refreshTabaleData,
  onLoading,
  onSizeChange,
  onCurrentChange,
  handleSearch,
  handleReset,
  handleUnDelete,
  openDialog,
  openDeleteDialog,
} = useClubColumns();

const router = useRouter();

const options = computed(() => useStore.departmentStore.getOptions());

const handleClick = (row) => {
  useStore.clubStore.setCurrentClub({
    club_name: row.club_name,
    club_id: row.club_id,
    department_name: row.department_name,
    role: "管理员",
  });
  delay(600).then(() => {
    message("切换基地成功：" + row.club_name, { type: "success" });
    // router.push(router.currentRoute.value.path);
  });
};

onMounted(() => {
  onLoading();
  fetchTableData();
  useStore.departmentStore.getOptionsList();
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
      <el-form-item class="items-center pr-8" label="基地" prop="club_name">
        <el-input
          v-model="query.club_name"
          style="width: 240px"
          placeholder="请输入基地/社团名称"
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
      <template #left>
        <el-button
          v-ripple
          type="primary"
          :icon="CirclePlus"
          @click="openDialog('新增基地/社团')"
          >新增</el-button
        >
      </template>

      <template #right>
        <el-button
          v-ripple
          type="primary"
          @click="exportExcel(columns, tableData, '基地管理')"
          :icon="Download"
        >
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
            <div>
              <el-button
                v-if="!row.is_deleted"
                type="danger"
                :size="size"
                :icon="Delete"
                text
                @click="openDeleteDialog('删除基地/社团', row)"
                >删除</el-button
              >
              <el-popconfirm
                v-if="row.is_deleted"
                title="无法恢复数据"
                @confirm="handleUnDelete(row)"
              >
                <template #reference>
                  <el-button type="danger" :size="size" :icon="Refresh" text
                    >恢复</el-button
                  >
                </template>
              </el-popconfirm>

              <el-button
                type="primary"
                :size="size"
                @click="openDialog('设置教师负责人', row)"
                text
                >设置负责人</el-button
              >
              <el-button type="success" :size="size" @click="handleClick(row)"
                >进入详情</el-button
              >
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
}
</style>
