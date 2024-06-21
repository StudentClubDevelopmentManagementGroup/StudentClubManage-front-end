<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import useStore from "@/store";
import { useRenderIcon } from "@/components/Icon/hooks";
import { useRole } from "./hook.tsx";
import dutyApi from "@/api/duty";
import { PureTableBar } from "@/components/PureTableBar";
import type { PaginationProps } from "@pureadmin/table";
import { message } from "@/utils/message";
import { exportExcel } from "@/utils/export.ts";

import { CirclePlus, Delete, Download, Refresh } from "@element-plus/icons-vue";

const { columns, loadingConfig, openDialog, openAddDialog } = useRole();

const isAutoDuty = ref(false);
const loading = ref(true);
const dataList = ref([]);
const formRef = ref();
const club_id = computed(() => useStore.clubStore.getCurrentClub().club_id);
const query = ref({
  club_id: club_id.value,
  group_name: "",
  name: "",
  page_num: 1,
  page_size: 10,
});

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true,
});

const exportFile = () => {
  exportExcel(columns, dataList.value, "group-list");
};

const getGroupData = async () => {
  loading.value = true;
  await dutyApi
    .getAllGroup(query.value)
    .then((data) => {
      pagination.total = data.total_item;
      pagination.pageSize = data.page_size;
      pagination.currentPage = data.current_page;
      dataList.value = data.records;
    })
    .catch((e) => {
      console.error(e.message);
    })
    .finally(() => (loading.value = false));
};

const getAutoDuty = async () => {
  await dutyApi
    .getAutoDuty(club_id.value)
    .then((data) => {
      isAutoDuty.value = data.isCirculation;
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const setAutoDuty = async () => {
  const req = {
    club_id: club_id.value,
    circulation: isAutoDuty.value ? 0 : 1,
  };
  await dutyApi
    .setAutoDuty(req)
    .then((data) => {
      message("修改成功", { type: "success" });
      isAutoDuty.value = !isAutoDuty.value;
    })
    .catch((e) => {
      console.error(e.message);
    });
};

function handleSizeChange(val: number) {
  query.value.page_size = val;
  getGroupData();
  
}

function handleCurrentChange(val: number) {
  query.value.page_num = val;
  getGroupData();
}

onMounted(() => {
  getGroupData();
  getAutoDuty();
});

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  getGroupData();
};

const delMember = (row, index) => {
  const req = {
    group_name: row.group_name,
    member_id: row.member_id,
    club_id: club_id.value,
  };
  dutyApi
    .delMember(req)
    .then((data) => {
      getGroupData()
      message("删除成功", { type: "success" });
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const delGroupDuty = (row) => {
  const req = {
    group_name: row.group_name,
    duty_time: row.date_time,
    club_id: club_id.value,
  };
  dutyApi
    .delGroupDuty(req)
    .then((data) => {
      message("删除成功", { type: "success" });
    })
    .catch((e) => {
      console.error(e.message);
    });
};
</script>

<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="query"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
  >
    <el-form-item label="小组名" prop="number">
      <el-input
        v-model="query.group_name"
        placeholder="请输入小组名称"
        clearable
        class="!w-[180px]"
      />
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input
        v-model="query.name"
        placeholder="请输入值日生姓名"
        clearable
        class="!w-[180px]"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon('ri:search-line')"
        :loading="loading"
        @click="getGroupData"
      >
        搜索
      </el-button>
      <el-button :icon="Refresh" @click="resetForm(formRef)"> 重置 </el-button>
    </el-form-item>
  </el-form>
  <PureTableBar :columns="columns" @refresh="getGroupData">
    <template #left>
      <el-button type="primary" :icon="CirclePlus" @click="openAddDialog()" v-ripple
        >新增小组</el-button
      >
    </template>
    <template #right>
      <el-popconfirm title="是否确认修改自动值日?" @confirm="setAutoDuty()">
        <template #reference>
          <el-button type="primary" plain v-ripple>{{
            isAutoDuty ? "自动安排值日" : "非自动安排值日"
          }}</el-button></template
        >
      </el-popconfirm>
      <el-button type="primary" @click="exportFile" :icon="Download" v-ripple>
        导出
      </el-button>
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        ref="tableRef"
        row-key="user_id"
        align-whole="center"
        showOverflowTooltip
        table-layout="auto"
        :loading="loading"
        :size="size"
        border
        :data="dataList"
        :loading-config="loadingConfig"
        :columns="dynamicColumns"
        :pagination="pagination"
        :paginationSmall="size === 'small' ? true : false"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
        }"
        @page-size-change="handleSizeChange"
        @page-current-change="handleCurrentChange"
      >
        <template #operation="{ row, index }">
          <el-button
            type="primary"
            :icon="CirclePlus"
            @click="openDialog('新增', row.group_name)"
            v-ripple
            >小组值日</el-button
          >
          <el-button
            type="primary"
            :icon="CirclePlus"
            @click="openAddDialog(row.group_name, true)"
            plain
            v-ripple
            >添加成员</el-button
          >
          <el-popconfirm
            title="是否确认清空该小组值日?"
            @confirm="delGroupDuty(row)"
          >
            <template #reference>
              <el-button type="danger" plain v-ripple>清空值日</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="是否确认删除?" @confirm="delMember(row, index)" >
            <template #reference>
              <el-button
                class="reset-margin"
                type="danger"
                :icon="Delete"
                :size="size"
                v-ripple
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </pure-table>
    </template>
  </PureTableBar>
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
