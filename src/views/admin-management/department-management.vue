<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { addDepartmentRules, modifyDepartmentRules } from "./utils/rule";
import { baseData } from "./test-data/mock";
import { message } from "@/utils/message";
import {
  getDepartmentList,
  addDepartment,
  deleteDepartment,
  modifyDepartment,
} from "@/api/admin-management";
// TODO: const multipleSelection = ref([]);

// 测试表格数据
const tableData = ref(baseData);
// 分页获取基地列表数据 与 检索关键字
const currentPage = ref(1);
const pageSize = ref(13);
const total = ref(100);
const computeTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

const fetchTableData = async (value) => {
  return new Promise((resolve, reject) => {
    getDepartmentList()
      .then((data) => {
        if (data) {
          // 查询到非空数据
          tableData.value = [...data];
          total.value = data.length;
          resolve();
        } else {
          // 查询到空数据
          tableData.value = [];
          total.value = 0;
          reject();
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  });
};
const handleSizeChange = () => {
  // TODO:逻辑bug,在total大于size时，从第2页或者后续几页将size调至大于total时触发，导致发生两次查询请求
};
const handleCurrentChange = () => {};

// 对话框-新增院系数据
const dialogAdded = ref(false);
const addedBtnLoading = ref(false);
const addFormRef = ref(null);
const addDepartmentParams = reactive({
  fullName: null,
  abbreviation: null,
});
const addNewDepartment = async (value) => {
  return new Promise((resolve, reject) => {
    addDepartment(value)
      .then((data) => {
        message("添加成功", { type: "success" });
        dialogAdded.value = false;
        addDepartmentParams.fullName = null;
        addDepartmentParams.abbreviation = null;
        fetchTableData();
      })
      .catch((error) => {
        console.warn(error);
      });
  });
};
const handleAdd = () => {
  dialogAdded.value = true;
};
const handleConfirmAdded = () => {
  addedBtnLoading.value = true;
  addFormRef.value.validate((valid, fields) => {
    if (valid) {
      addNewDepartment(addDepartmentParams);
    }
  });
  setTimeout(() => {
    addedBtnLoading.value = false;
  }, 1000);
};
// 取消批量操作
const selectStatus = ref(false);
const handleCancelAllSelected = () => {
  console.log("这里是取消批量操作");
};
// 对话框-删除院系
const dialogDeleteDepartment = ref(false);
const warnInfo = ref("");
const confirmDeleteInput = ref("");
const deleteBtnLoading = ref(false);
const deleteBtnStatus = computed(() => {
  return !(warnInfo.value === confirmDeleteInput.value);
});
const deleteOldDepartment = async (value) => {
  return new Promise((resolve, reject) => {
    deleteDepartment(value)
      .then((data) => {
        message("删除成功", { type: "success" });
        dialogDeleteDepartment.value = false;
        confirmDeleteInput.value = "";
        fetchTableData();
      })
      .catch((error) => {
        console.warn(error);
      });
  });
};
const handleClickBtn = (row) => {
  dialogDeleteDepartment.value = true;
  warnInfo.value = row.fullName;
};
const handleConfirmDeleteDepartment = () => {
  deleteBtnLoading.value = true;
  deleteOldDepartment(warnInfo.value);
  setTimeout(() => {
    deleteBtnLoading.value = false;
  }, 1000);
};
// 对话框-修改院系
const dialogModified = ref(false);
const modifyFormRef = ref(null);
const modifiedBtnLoading = ref(false);
const modifyDepartmentInfoParams = reactive({
  id: "",
  fullName: "",
  abbreviation: "",
});
const modifyOldDepartment = async (value) => {
  return new Promise((resolve, reject) => {
    //TODO: 修改院系
    modifyDepartment(value)
      .then((data) => {
        message("修改成功", { type: "success" });
        dialogModified.value = false;
        fetchTableData();
      })
      .catch((error) => {
        console.warn(error);
      });
  });
};
const handleClickBtn2 = (row) => {
  dialogModified.value = true;
  // TODO：修改成id修改
  modifyDepartmentInfoParams.id = row.id;
  modifyDepartmentInfoParams.fullName = row.fullName;
  modifyDepartmentInfoParams.abbreviation = row.abbreviation;
};
const handleConfirmModified = () => {
  dialogModified.value = false;
  modifyOldDepartment(modifyDepartmentInfoParams);
  setTimeout(() => {
    modifiedBtnLoading.value = false;
  });
};

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div id="container">
    <!-- 数据表格展示及操作区域 -->
    <div id="down-container">
      <el-card class="table-container" shadow="always">
        <!-- 操作按钮 -->
        <template #header>
          <div id="operation">
            <div id="operation-left">
              <el-button
                v-if="selectStatus"
                @click="handleCancelAllSelected"
                type="success"
                >取消全选</el-button
              >
            </div>
            <div id="operation-right">
              <el-button type="primary" :icon="CirclePlus" @click="handleAdd"
                >新增</el-button
              >
            </div>
          </div>
        </template>
        <!-- 数据表格 -->
        <div id="table">
          <el-table
            ref="TableRef"
            :data="computeTableData"
            table-layout="auto"
            border
            size="large"
          >
            <el-table-column type="selection" align="center" />
            <el-table-column property="id" label="学院序号" align="center" />
            <el-table-column
              property="fullName"
              label="学院全称"
              align="center"
            />
            <el-table-column
              property="abbreviation"
              label="学院简称"
              align="center"
            />
            <!-- 操作 -->
            <el-table-column align="right">
              <template #default="scope">
                <div>
                  <el-button
                    type="danger"
                    text
                    @click="handleClickBtn(scope.row)"
                    >变更为删除状态</el-button
                  >
                  <el-button
                    type="success"
                    text
                    @click="handleClickBtn2(scope.row)"
                    >编辑</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 页签 -->
        <template #footer>
          <div id="pager">
            <div class="demo-pagination-block">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[13, 26, 39]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </template>
      </el-card>
    </div>
    <!--  弹出处理 新增 的对话框 -->
    <el-dialog
      v-model="dialogAdded"
      title="新增学院"
      width="500"
      align-center
      destroy-on-close
    >
      <el-form
        :model="addDepartmentParams"
        ref="addFormRef"
        :rules="addDepartmentRules"
      >
        <el-form-item prop="fullName" label="全名">
          <el-input
            v-model="addDepartmentParams.fullName"
            placeholder="请输入学院全称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="abbreviation" label="简称">
          <el-input
            v-model="addDepartmentParams.abbreviation"
            placeholder="请输入学院简称"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogAdded = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleConfirmAdded"
            :loading="addedBtnLoading"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 弹出处理 删除院系 的对话框 -->
    <el-dialog
      v-model="dialogDeleteDepartment"
      title="删除院系"
      align-center
      width="500"
      destroy-on-close
    >
      <el-result
        icon="warning"
        title="删除院系，谨慎操作！"
        :sub-title="'请输入' + '“' + warnInfo + '”' + '以确认删除院系'"
      />
      <div id="delete-operation">
        <el-input v-model="confirmDeleteInput"></el-input>
        <el-button
          round
          plain
          type="danger"
          @click="handleConfirmDeleteDepartment"
          :disabled="deleteBtnStatus"
          :loading="deleteBtnLoading"
          >我想要删除院系</el-button
        >
      </div>
    </el-dialog>
    <!-- 弹出处理 修改院系信息 的对话框 -->
    <el-dialog
      v-model="dialogModified"
      title="编辑院系信息"
      width="500"
      align-center
      destroy-on-close
    >
      <el-form
        :model="modifyDepartmentInfoParams"
        ref="modifyFormRef"
        :rules="modifyDepartmentRules"
      >
        <el-form-item prop="fullName" label="全称">
          <el-input
            v-model="modifyDepartmentInfoParams.fullName"
            placeholder="请输入学院全称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="abbreviation" label="简称">
          <el-input
            v-model="modifyDepartmentInfoParams.abbreviation"
            placeholder="请输入学院简称"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogModified = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleConfirmModified"
            :loading="modifiedBtnLoading"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
#container {
  display: grid;
  grid-template-rows: auto;
}
/*  数据表格展示及操作区域样式 */
#down-container {
  padding: 39px 0px;
}
#operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#table {
  background: red;
}
.table-container:deep() .el-card__header {
  padding: 10px;
}
.table-container:deep() .el-card__body {
  padding: 0px;
}
/* 修复未指定列的宽度，导致在界面展开/收起时发生的宽度异常，而破坏容器 */
.table-container:deep() .el-scrollbar__view {
  width: 100%;
}
.table-container:deep() .el-table__body {
  width: 100% !important;
  min-width: 1100px;
}
/* 修复未指定列的宽度，导致在界面展开/收起时发生的宽度异常，而破坏容器 */

.table-container:deep() .el-table__inner-wrapper {
  /* 调整el-table 使其在item不足的情况下高度不坍塌 */
  min-height: 693px;
}

/* 修复el-button按钮外边距与高度过大导致的UI异常 */
.table-container:deep() .el-table__cell:nth-child(5) .el-button {
  height: auto;
  padding: 0px;
  padding-right: 10px;
  padding-left: 10px;
}
/* 修复el-button按钮外边距与高度过大导致的UI异常 */

#pager {
  display: flex;
  justify-content: center;
}
.table-container:deep() .el-card__footer {
  padding: 10px;
}
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
/*  数据表格展示及操作区域样式 */

/* 弹出对话框样式 */
#container:deep() .el-dialog__title {
  color: black;
  font-weight: bolder;
  font-size: larger;
}
#container:deep() .el-form-item__label {
  color: black;
  font-weight: 500;
  font-size: large;
}
#container:deep() .el-result__title p {
  color: red;
  font-size: large;
  font-weight: bold;
}
#container:deep() .el-result__subtitle p {
  color: black;
  font-size: medium;
  font-weight: 600;
}
#delete-operation:deep() .el-input__wrapper {
  border: 1px solid red;
}
#delete-operation .el-button {
  width: 100%;
  margin-top: 20px;
  font-size: large;
}
/* 弹出对话框样式 */
</style>
