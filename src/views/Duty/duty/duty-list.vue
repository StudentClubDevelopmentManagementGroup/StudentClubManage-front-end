<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import useStore from "@/store";
import { useRenderIcon } from "@/components/Icon/hooks";
import { useRole } from "./hook";
import { exportExcel } from "@/utils/export.ts";
import dutyApi from "@/api/duty";
import { PureTableBar } from "@/components/PureTableBar";
import type { PaginationProps } from "@pureadmin/table";
import { message } from "@/utils/message";
import { GetToken } from "@/utils/auth";

import constants from "@/config";
import axios from "axios";
import { CirclePlus, Delete, Download, Refresh } from "@element-plus/icons-vue";

const { columns, loadingConfig, openDialog } = useRole();

const fileList = ref([]);
const isAutoDuty = ref(false);
const loading = ref(true);
const dataList = ref([]);
const formRef = ref();
const club_id = computed(() => useStore.clubStore.getCurrentClub().club_id);
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
  exportExcel(columns, dataList.value, "duty-list");
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
  getAutoDuty();
});

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  getDutyData();
};

const delDuty = (row, index) => {
  const req = {
    date_time: row.date_time,
    cleaner_id: row.cleaner_id,
    club_id: club_id.value,
  };
  dutyApi
    .delDuty(req)
    .then((data) => {
      dataList.value.splice(index, 1);
      pagination.total = pagination.total - 1;
      message("删除成功", { type: "success" });
    })
    .catch((e) => {
      console.error(e.message);
    });
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

const httpRequest = (image) => {
  const { file } = image;
  const { date_time, member_id, club_id ,index} = file.rowData;
  delete file.rowData;
  const formData = new FormData();
  formData.append("date_time", date_time);
  formData.append("member_id", member_id);
  formData.append("club_id", club_id);
  fileList.value.forEach((item) => {
    formData.append("file", item.raw);
  });
  axios({
    method: "POST",
    url: constants.baseUrl + "/club/duty/report_results",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "Guet-S-C-M-S-Token": GetToken(),
    },
  }).then((res) => {
    const data = res.data;
    if (data.status_code / 100 === 2) {
      dataList.value[index].image_file = data.data
      // message("上传成功", { type: "success" });
    } else {
      message("上传失败", { type: "error" });
    }
  });
};

const beforeUpload = (file, row, index) => {
  file.rowData = {
    club_id: row.club_id,
    date_time: row.date_time,
    member_id: row.cleaner_id,
    index: index,
  };
  return true;
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
        placeholder="请输入房间号"
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
      v-ripple
        type="primary"
        :icon="useRenderIcon('ri:search-line')"
        :loading="loading"
        @click="getDutyData"
      >
        搜索
      </el-button>
      <el-button :icon="Refresh" @click="resetForm(formRef)" v-ripple> 重置 </el-button>
    </el-form-item>
  </el-form>
  <PureTableBar :columns="columns" @refresh="getDutyData">
    <template #left>
      <el-button type="primary" :icon="CirclePlus" @click="openDialog()" v-ripple
        >新增</el-button
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
        <template #image_file="{ row, index }">
          <el-image
            v-if="row.image_file"
            preview-teleported
            loading="lazy"
            :src="row.image_file"
            :preview-src-list="row.image_file"
            :initial-index="index"
            fit="cover"
            class="w-[148px] h-[148px]"
          />
          <el-upload
            v-else
            v-model:file-list="fileList"
            :http-request="httpRequest"
            accept="image/*"
            multiple
            :show-file-list="false"
            list-type="picture-card"
            :before-upload="(file) => beforeUpload(file, row, index)"
          >
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </template>
        <template #operation="{ row, index }">
          <el-popconfirm title="是否确认删除?" @confirm="delDuty(row, index)">
            <template #reference>
              <el-button
              v-ripple
                class="reset-margin"
                type="danger"
                :icon="Delete"
                :size="size"
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
