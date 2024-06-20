<script setup lang="ts">
import { ref, h, reactive, onMounted, computed } from "vue";
import Data from "./data.json";
import { deviceDetection } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { exportExcel } from "@/utils/export.ts";
import memberApi from "@/api/member";
import useStore from "@/store";

import type { PaginationProps } from "@pureadmin/table";
import { useRole, FormItemProps } from "./hook.tsx";

import { PureTableBar } from "@/components/PureTableBar";
import { useRenderIcon } from "@/components/Icon/hooks";
import editForm from "./form.vue";
import { addDialog } from "@/components/Dialog";

import {
  CirclePlus,
  Delete,
  Download,
  Upload,
  Refresh,
} from "@element-plus/icons-vue";

const { columns, loadingConfig } = useRole();

const loading = ref(true);
const dataList = ref([]);
const department = ref(Data.department);
const formRef = ref();
const tableRef = ref();
const selectedMember = ref([]);
const club_id = computed(() => useStore.userStore.getClubId);
const query = ref({
  pagenum: 1,
  size: 10,
  club_id: club_id.value,
  department_id: "",
  name: "",
});
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true,
});

const exportFile = () => {
  exportExcel(columns, dataList.value, "member-list");
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  getMemberData();
};

function handleSelectionChange(val) {
  selectedMember.value = val;
}

function handleSizeChange(val: number) {
  query.value.size = val;
  getMemberData();
}

function handleCurrentChange(val: number) {
  query.value.pagenum = val;
  getMemberData();
}

onMounted(() => {
  getMemberData();
});

const getMemberData = async () => {
  loading.value = true;
  await memberApi
    .getAllMember(query.value)
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

const delMember = (user_id) => {
  memberApi
    .delMember({ user_id, club_id: club_id.value })
    .then(() => {
      getMemberData();
      message("删除成功", { type: "success" });
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const setManager = (user_id) => {
  memberApi
    .setManager({ user_id, club_id: club_id.value })
    .then(() => {
      getMemberData();
      message("设置成功", { type: "success" });
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const revokeManager = (user_id) => {
  memberApi
    .revokeManager({ user_id, club_id: club_id.value })
    .then(() => {
      getMemberData();
      message("撤销成功", { type: "success" });
    })
    .catch((e) => {
      console.error(e.message);
    });
};

function openDialog(title = "新增", row?: FormItemProps) {
  addDialog({
    title: `${title}角色`,
    props: {
      formInline: {
        userId: row?.userId ?? "",
      },
    },
    width: "32%",
    draggable: true,
    fullscreen: deviceDetection(),
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(editForm, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      const curData = options.props.formInline as FormItemProps;
      function chores() {
        memberApi
          .addMember({ user_id: curData.userId, club_id: club_id.value })
          .then(() => {
            getMemberData();
            done(); // 关闭弹框
            message("添加成功", { type: "success" });
          })
          .catch((e) => {
            console.error(e.message);
          });
      }
      FormRef.validate((valid) => {
        if (valid) {
          if (title === "新增") {
            chores();
          }
        }
      });
    },
  });
}
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="query"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="query.name"
          placeholder="请输入姓名"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="学院" prop="department_id">
        <el-select
          v-model="query.department_id"
          @change="getMemberData()"
          placeholder="请选择学院"
          style="width: 240px"
        >
          <el-option
            v-for="item in department"
            :key="item.id"
            :label="item.fullName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
        v-ripple
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="getMemberData"
        >
          搜索
        </el-button>
        <el-button v-ripple :icon="Refresh" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar :columns="columns" @refresh="getMemberData">
      <template #left>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog()" v-ripple
          >新增</el-button
        >
        <el-button type="primary" :icon="Upload" plain v-ripple>导入</el-button>
      </template>
      <template #right>
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
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #role="{ row }">
            <el-tag v-if="row.role.is_club_manager" type="danger"
              >负责人</el-tag
            >
            <el-tag v-else type="primary">普通成员</el-tag>
            <el-tag
              v-if="row.role.is_teacher"
              style="margin-left: 10px"
              type="success"
              >教师</el-tag
            >
            <el-tag v-else style="margin-left: 10px" type="success"
              >学生</el-tag
            >
          </template>
          <template #operation="{ row }">
            <el-button
              v-if="row.role.is_club_manager"
              class="reset-margin"
              type="danger"
              :size="size"
              v-ripple
              @click="revokeManager(row.user_id)"
            >
              撤销负责人
            </el-button>
            <el-button
              v-else
              class="reset-margin"
              type="primary"
              :size="size"
              v-ripple
              @click="setManager(row.user_id)"
            >
              设置负责人
            </el-button>
            <el-popconfirm
              title="是否确认删除?"
              @confirm="delMember(row.user_id)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  type="danger"
                  :size="size"
                  plain
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
  </div>
</template>
