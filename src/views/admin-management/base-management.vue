<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { baseStore } from "@/store/base";
import { addBaseRules, setManagerRules } from "./utils/rule";
import { baseData, departmentData, departmentSwtichData } from "./test-data/mock";
import { message } from "@/utils/message";
import { getBaseList, addBase, deleteBase, recoverBase } from "@/api/admin-management";
const multipleSelection = ref([]);

// 测试表格数据
const tableData = ref(baseData);
// 分页获取基地列表数据 与 检索关键字
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);
const input1 = ref(null);
const input2 = ref(null);
const searchStatus = ref(false); // 查询标志状态
const getBaseListParams = computed(() => ({
  pagenum: currentPage.value,
  size: pageSize.value,
}));
const queryBaseListParams = computed(() => ({
  pagenum: currentPage.value,
  size: pageSize.value,
  name: input1.value === "" ? null : input1.value,
  departmentId: input2.value === "" ? null : input2.value,
}));

const fetchData = async (value) => {
  return new Promise((resolve, reject) => {
    getBaseList(value)
      .then((data) => {
        if (data && data.records !== undefined) {
          // 查询到非空数据
          tableData.value = [...data.records];
          total.value = data.total;
          resolve();
        } else {
          // 查询到空数据
          tableData.value = [];
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
  if (searchStatus.value === true) {
    fetchData(queryBaseListParams.value);
  } else {
    fetchData(getBaseListParams.value);
  }
};
const handleCurrentChange = () => {
  if (searchStatus.value === true) {
    fetchData(queryBaseListParams.value);
  } else {
    fetchData(getBaseListParams.value);
  }
};
const handleSearch = () => {
  if (
    (input1.value != null && input1.value !== "") ||
    (input2.value != null && input2.value !== "")
  ) {
    // 有任一检索关键字
    searchStatus.value = true;
    fetchData(queryBaseListParams.value);
  } else {
    // 没有检索关键字
    searchStatus.value = false;
    fetchData(getBaseListParams.value);
  }
};
const handleReset = () => {
  input1.value = null;
  input2.value = null;
};
const handleCancelSearch = () => {
  searchStatus.value = false;
  fetchData(getBaseListParams.value);
};
// 获取院系数据
const selectData = ref(departmentData);

// 对话框-新增基地数据
const dialogAdded = ref(false);
const addedBtnLoading = ref(false);
const addFormRef = ref(null);
const addBaseParams = reactive({
  name: null,
  department_id: null,
});
const addNewBase = async (value) => {
  return new Promise((resolve, reject) => {
    addBase(value)
      .then((data) => {
        setTimeout(() => {
          message("添加成功", { type: "success" });
          addedBtnLoading.value = false;
          dialogAdded.value = false;
          addBaseParams.name = null;
          addBaseParams.department_id = null;
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          addedBtnLoading.value = false;
        }, 1000);
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
      addNewBase(addBaseParams);
    } else {
      addedBtnLoading.value = false;
    }
  });
};
// 取消批量操作
const selectStatus = ref(false);
const handleCancelAllSelected = () => {
  console.log("这里是取消批量操作");
};
// 对话框-修改状态
const dialogDeleted = ref(false);
const departmentId = ref("");
const name = ref("");
const changeStatusParams = computed(() => ({
  department_id: departmentId.value,
  name: name.value,
}));

const changeDeletedStatus = () => {
  return new Promise((resolve, reject) => {
    deleteBase(changeStatusParams.value)
      .then(() => {
        baseStore().state.row.is_deleted = true;
        resolve();
      })
      .catch((err) => {
        console.warn(err);
      });
  });
};
const changeRecoveredStatus = () => {
  return new Promise((resolve, reject) => {
    recoverBase(changeStatusParams.value)
      .then(() => {
        baseStore().state.row.is_deleted = false;
        resolve();
      })
      .catch((err) => {
        console.warn(err);
      });
  });
};
const handleSwitch = (row) => {
  dialogDeleted.value = true;
  baseStore().setRow(row);
  departmentId.value = row.department_id;
  name.value = row.name;
  return false;
};
const handleConfirmDeleted = () => {
  dialogDeleted.value = false;
  if (baseStore().state.row.is_deleted === true) {
    changeRecoveredStatus();
  } else {
    changeDeletedStatus();
  }
};

// 对话框-设置基地负责人
const dialogSetManager = ref(false);
const setFormRef = ref(null);
const columnInfo = reactive({
  name: "",
  department_name: "",
});
const setBtnLoading = ref(false);
const setBaseManagerParams = reactive({
  club_id: null,
  user_id: null,
});
const handleClickBtn = (row) => {
  dialogSetManager.value = true;
  columnInfo.name = row.name;
  columnInfo.department_name = row.department_name;
  setBaseManagerParams.club_id = row.club_id;
};
const handleConfirmSetManager = () => {
  setBtnLoading.value = true;
  setFormRef.value.validate((value, fields) => {
    if (value) {
      setTimeout(() => {
        setBtnLoading.value = false;
      }, 1000);
    } else {
      setBtnLoading.value = false;
    }
  });
};
// 进入基地管理端界面
const handleClickBtn2 = (row) => {
  // TODO:进入基地管理端，理论上传入基地id，进一步的等待 车 开发
  console.log("编辑", row);
};

onMounted(() => {
  fetchData(getBaseListParams.value);
});
</script>

<template>
  <el-scrollbar>
    <div id="container">
      <!-- 检索关键字区域 -->
      <div id="up-container">
        <el-card class="search-container" shadow="always">
          <!-- TODO:面包屑没有导航功能，暂时不做,这里预留位置 -->
          <template #header>
            <div id="breadcrumb">
              <span>面包屑占位</span>
            </div>
          </template>
          <!-- 检索关键字 -->
          <div id="search">
            <!-- 搜索输入框 -->
            <div>
              <span>基地：</span>
              <el-input
                v-model="input1"
                style="width: 240px"
                placeholder="请输入基地/社团名称"
              />
              <span>院系：</span>
              <el-select
                v-model="input2"
                placeholder="请选择学院名称"
                style="width: 240px"
              >
                <el-option
                  v-for="item in selectData"
                  :label="item.full_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <!-- 操作 -->
            <div>
              <el-button type="primary" style="margin-right: 10px" @click="handleSearch"
                >查询</el-button
              >
              <el-button type="success" v-if="searchStatus" @click="handleCancelSearch"
                >取消检索</el-button
              >
              <el-button @click="handleReset">重置</el-button>
            </div>
          </div>
        </el-card>
      </div>
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
            <el-table ref="TableRef" :data="tableData" table-layout="auto" size="large">
              <el-table-column type="selection" align="center" />
              <el-table-column property="name" label="基地/社团名称" align="center" />
              <el-table-column
                property="department_name"
                label="学院名称"
                align="center"
              />
              <el-table-column property="number" label="总人数" align="center" />
              <el-table-column property="manager" label="教师负责人" align="center" />
              <!-- 编辑 启用/未启用 方法 -->
              <el-table-column label="启用/未启用" align="center">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.is_deleted"
                    :active-value="false"
                    :inactive-value="true"
                    :before-change="() => handleSwitch(scope.row)"
                  />
                </template>
              </el-table-column>
              <!-- 显示招新状态 -->
              <el-table-column label="招新状态" align="center">
                <template #default="scope">
                  <el-tag :type="!scope.row.state ? 'success' : 'danger'">{{
                    !scope.row.state ? "正在招新" : "终止招新"
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column>
                <template #default="scope">
                  <div>
                    <el-button type="primary" text @click="handleClickBtn(scope.row)"
                      >设置教师负责人</el-button
                    >
                    <el-button type="success" text @click="handleClickBtn2(scope.row)"
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
                  :page-sizes="[10, 20, 30, 40]"
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
      <!-- 弹出处理 启用/未启用 状态修改的对话框 -->
      <el-dialog v-model="dialogDeleted" title="修改基地状态" width="500">
        <span>请确认要修改状态</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogDeleted = false">取消</el-button>
            <el-button type="primary" @click="handleConfirmDeleted"> 确认 </el-button>
          </div>
        </template>
      </el-dialog>
      <!--  弹出处理 新增 的对话框 -->
      <el-dialog
        v-model="dialogAdded"
        title="新增基地"
        width="500"
        align-center
        destroy-on-close
      >
        <el-form :model="addBaseParams" ref="addFormRef" :rules="addBaseRules">
          <el-form-item prop="name" label="名称">
            <el-input
              v-model="addBaseParams.name"
              placeholder="请输入基地/社团名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="department_id" label="院系">
            <el-select v-model="addBaseParams.department_id" placeholder="请选择院系">
              <el-option
                v-for="item in selectData"
                :label="item.full_name"
                :value="item.id"
              ></el-option>
            </el-select>
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
      <!-- 弹出处理 设置教师负责人 的对话框 -->
      <el-dialog
        v-model="dialogSetManager"
        title="设置基地教师负责人"
        align-center
        width="500"
        destroy-on-close
      >
        <el-form :model="setBaseManagerParams" ref="setFormRef" :rules="setManagerRules">
          <el-form-item id="column-info">
            <div>基地名称：</div>
            <div>{{ columnInfo.name }}</div>
            <div>学院名称：</div>
            <div>{{ columnInfo.department_name }}</div>
          </el-form-item>
          <el-form-item prop="user_id" label="工号">
            <el-input
              v-model="setBaseManagerParams.user_id"
              placeholder="请输入教师负责人工号"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogSetManager = false">取消</el-button>
            <el-button
              type="primary"
              @click="handleConfirmSetManager"
              :loading="setBtnLoading"
            >
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>

<style scoped>
#container {
  display: grid;
  grid-template-rows: 175px auto; /* 上块高度为150px，下块高度自适应 */
}
/* 检索关键字区域样式 */
#up-container {
  padding: 20px 40px;
}
.search-container {
  width: 100%;
  height: 100%;
}
#search {
  display: flex;
  justify-content: space-between;
}
#search span {
  margin-right: 5px;
}
#search span:not(:first-child) {
  margin-left: 20px;
}
#search > div {
  display: flex;
  align-items: center;
}
/* 检索关键字区域样式 */

/*  数据表格展示及操作区域样式 */
#down-container {
  padding: 10px 40px;
}
.table-container {
  height: 100%;
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
  min-width: 1600px;
}
/* 修复未指定列的宽度，导致在界面展开/收起时发生的宽度异常，而破坏容器 */

.table-container:deep() .el-table__inner-wrapper {
  /* 调整el-table 使其在item不足的情况下高度不坍塌 */
  min-height: 545px;
}

/* 修复el-switch开关撑大行外间距导致的UI异常 */
.table-container:deep() .el-table__cell:nth-child(6) {
  padding: 0px !important;
}
.table-container:deep() .el-table__cell:nth-child(7) {
  padding: 0px !important;
}
/* 修复el-switch开关撑大行外间距导致的UI异常 */

/* 修复el-button按钮外边距与高度过大导致的UI异常 */
.table-container:deep() .el-table__cell:nth-child(8) .el-button {
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
#column-info div:not(:first-child):nth-child(odd) {
  margin-left: 10px;
}
#column-info div:nth-child(even) {
  color: black;
  font-weight: 500;
  font-size: medium;
}
#column-info div:nth-child(odd) {
  color: black;
  font-weight: 600;
  font-size: medium;
}
/* 弹出对话框样式 */
</style>
