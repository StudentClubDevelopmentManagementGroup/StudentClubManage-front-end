<script setup lang="ts">
import { ref, h,toRaw } from "vue";
import { useRole, FormItemProps } from "./hook";
import { PureTableBar } from "@/components/PureTableBar";
import { useRenderIcon } from "@/components/Icon/hooks";
import Data from "./data.json";
import { CirclePlus, Delete, Download, Upload } from "@element-plus/icons-vue";
import Refresh from "@iconify-icons/ep/refresh";
import { deviceDetection } from "@pureadmin/utils";
import editForm from "./form.vue";
import { addDialog } from "@/components/Dialog";
import { message } from "@/utils/message";
import memberApi from "@/api/member";
import { exportExcel } from "@/utils/export.ts";

// const loading = ref(true);
const dataList = ref(Data.data.records);
const department = ref(Data.department);
const formRef = ref();
const tableRef = ref();
const selectedMember = ref([]);

// const getMemberData = async () => {
//   loading.value = true;
//   await memberApi
//     .getAllMember()
//     .then((data) => {

//     })
//     .catch((e) => {
//       console.error(e.message);
//     })
//     .finally(() => (loading.value = false));
// };

function handleSelectionChange(val) {
  selectedMember.value = val;
}

const delMember = () => {
  console.log(toRaw(selectedMember.value));
  
};

const exportFile = () => {
  exportExcel(columns, dataList, "member-list");
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
        message(`您${title}了角色名称为${curData.name}的这条数据`, {
          type: "success",
        });
        done(); // 关闭弹框
        onSearch(); // 刷新表格数据
      }
      FormRef.validate((valid) => {
        if (valid) {
          console.log("curData", curData);
          // 表单规则校验通过
          if (title === "新增") {
            // 实际开发先调用新增接口，再进行下面操作
            chores();
          } else {
            // 实际开发先调用修改接口，再进行下面操作
            chores();
          }
        }
      });
    },
  });
}

const {
  form,
  columns,
  loading,
  pagination,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
} = useRole();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入姓名"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="学院" prop="department_id">
        <el-select
          v-model="form.department_id"
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
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar :columns="columns" @refresh="onSearch">
      <template #left>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog()"
          >新增</el-button
        >
        <el-button type="primary" :icon="Upload" @click="handleAdd" plain
          >导入</el-button
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
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          border
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
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
            <el-tag v-if="row.role.is_super_admin" type="danger"
              >超级管理员</el-tag
            >
            <el-tag
              v-if="row.role.is_club_member"
              style="margin-left: 10px"
              type="primary"
              >普通成员</el-tag
            >
            <el-tag v-else type="primary" style="margin-left: 10px"
              >负责人</el-tag
            >
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
              v-if="row.role.is_club_member"
              class="reset-margin"
              type="primary"
              :size="size"
            >
              设置负责人
            </el-button>
            <el-button v-else class="reset-margin" type="danger" :size="size">
              撤销负责人
            </el-button>
            <el-button class="reset-margin" type="danger" :size="size" plain>
              删除
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped></style>
