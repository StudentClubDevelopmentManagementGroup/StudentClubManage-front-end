<script setup lang="ts">
import { ref, h, toRaw, reactive, onMounted, computed } from "vue";
import useStore from "@/store";
import { useRenderIcon } from "@/components/Icon/hooks";
import { useRole } from "./hook";
import { exportExcel } from "@/utils/export.ts";
import dutyApi from "@/api/duty";
import { PureTableBar } from "@/components/PureTableBar";
import type { PaginationProps } from "@pureadmin/table";
import { message } from "@/utils/message";

import axios from "axios";
import { CirclePlus, Delete, Download, Refresh } from "@element-plus/icons-vue";

const { columns, loadingConfig, openDialog } = useRole();

const loading = ref(true);
const dataList = ref([]);
const imageUrl = ref("");
const formRef = ref();
const club_id = computed(() => useStore.userStore.getClubId);
const query = ref({
  club_id: club_id.value,
  number: "",
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
  exportExcel(columns, dataList, "duty-list");
};

const getDutyData = async () => {
  loading.value = true;
  await dutyApi
    .getAllDuty(query.value)
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

function handleSizeChange(val: number) {
  query.value.page_size = val;
  getDutyData();
}

function handleCurrentChange(val: number) {
  query.value.page_num = val;
  getDutyData();
}

onMounted(() => {
  getDutyData();
});

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  getDutyData();
};

const delDuty = (row) => {
  const req = {
    date_time: row.date_time,
    cleaner_id: row.cleaner_id,
    club_id: club_id.value,
  };
  dutyApi
    .delDuty(req)
    .then((data) => {
      getDutyData();
      message("删除成功", { type: "success" });
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const httpRequest = (image) => {
  const { file } = image;
  const { date_time, member_id, club_id } = file.rowData;
  delete file.rowData;
  const formData = new FormData();
  // conat arr = [file]
  formData.append("file", file);
  formData.append("date_time", "2024-06-14 12:00:00");
  formData.append("member_id", member_id);
  formData.append("club_id", club_id);
  // console.log(req);
  // dutyApi.addDutyReport(formData).then((data) => {
  //   message("上传成功", { type: "success" });
  // });
  axios({
    method: "POST",
    url: "http://10.70.107.20:3333/club/duty/report_result",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const beforeUpload = (file, row) => {
  console.log(file);

  file.rowData = {
    club_id: row.club_id,
    date_time: row.date_time,
    member_id: row.cleaner_id,
  };
  return true;
};
</script>

<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="query"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
  >
    <el-form-item label="房间号" prop="number">
      <el-input
        v-model="query.number"
        placeholder="请输入姓名"
        clearable
        class="!w-[180px]"
      />
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input
        v-model="query.name"
        placeholder="请输入姓名"
        clearable
        class="!w-[180px]"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon('ri:search-line')"
        :loading="loading"
        @click="getDutyData"
      >
        搜索
      </el-button>
      <el-button :icon="Refresh" @click="resetForm(formRef)"> 重置 </el-button>
    </el-form-item>
  </el-form>
  <PureTableBar :columns="columns" @refresh="getDutyData">
    <template #left>
      <el-button type="primary" :icon="CirclePlus" @click="openDialog()"
        >新增</el-button
      >
      <el-popconfirm title="是否确认删除?" @confirm="delMember">
        <template #reference>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </template>
      </el-popconfirm>
    </template>
    <template #right>
      <el-button type="primary" @click="exportFile" :icon="Download">
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
        <template #image_file="{ row }">
          <el-upload
            :http-request="httpRequest"
            accept="image/*"
            multiple
            :show-file-list="false"
            list-type="picture-card"
            :before-upload="(file) => beforeUpload(file, row)"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </template>
        <template #operation="{ row }">
          <el-popconfirm title="是否确认删除?" @confirm="delDuty(row)">
            <template #reference>
              <el-button class="reset-margin" type="danger" :size="size">
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
