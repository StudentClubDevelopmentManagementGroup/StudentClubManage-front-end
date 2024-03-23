<script setup>
import { reactive, ref, watch, toRaw, computed } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { baseStore } from "@/store/base";
import { getBaseList } from "@/api/admin-management";

const multipleSelection = ref([]);
// 测试表格数据
const tableData = reactive([
  {
    id: "1",
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 1,
    state: 0,
  },
  {
    id: "2",
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 1,
    state: 0,
  },
  {
    id: "3",
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 1,
    state: 0,
  },
  {
    id: "4",
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    id: "5",
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
]);

// 检索关键字
const input1 = ref("");
const input2 = ref("");

const handleSearch = () => {
  console.log("这是检索操作", "基地：" + input1.value, "院系：" + input2.value);
};
const handleReset = () => {
  input1.value = "";
  input2.value = "";
  console.log("这是重置操作");
};

// 新增
const handleAdd = () => {
  const testData = {
    id: "11",
    club_name: "新的名字",
    department_name: "新的学院",
    total_num: "20",
    manager: "新的经理",
    is_deleted: 0,
    state: 1,
  };
  console.log("这里是新增操作");
  tableData.push(testData);
};

// 对话框
const dialogDeleted = ref(false);
const dialogAdded = ref(false);

const handleSwitchChange2CheckDelete = (row) => {
  dialogDeleted.value = true;
  baseStore().setRow(row);
  return false;
};
const handleConfirmDeleted = () => {
  dialogDeleted.value = false;
  console.log(baseStore().state.row.is_deleted);
  if (baseStore().state.row.is_deleted === 1) {
    baseStore().state.row.is_deleted = 0;
  } else {
    baseStore().state.row.is_deleted = 1;
  }
  console.log(baseStore().state.row.is_deleted);
};
const handleSwitchChange2CheckAdd = (row) => {
  dialogAdded.value = true;
  baseStore().setRow(row);
  return false;
};
const handleConfirmAdded = () => {
  dialogAdded.value = false;
  if (baseStore().state.row.state === 1) {
    baseStore().state.row.state = 0;
  } else {
    baseStore().state.row.state = 1;
  }
};

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};

// getBaseList()
//   .then((response) => {
//     console.log("response", response);
//   })
//   .catch((err) => {
//     console.warn(err);
//   });
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
              <span style="margin-right: 5px">基地：</span>
              <el-input
                v-model="input1"
                style="width: 240px"
                placeholder="请输入基地/社团名称"
              />
              <span style="margin-right: 5px">院系：</span>
              <el-input
                v-model="input2"
                style="width: 240px"
                placeholder="请输入学院名称"
              />
            </div>
            <!-- 操作 -->
            <div>
              <el-button type="primary" style="margin-right: 10px" @click="handleSearch"
                >查询</el-button
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
              <el-button type="primary" :icon="CirclePlus" @click="handleAdd"
                >新增</el-button
              >
            </div>
          </template>
          <!-- 数据表格 -->
          <div id="table">
            <el-table
              ref="TableRef"
              :data="tableData"
              table-layout="auto"
              size="large"
              :fit="false"
            >
              <el-table-column type="selection" align="center" />
              <el-table-column
                property="club_name"
                label="基地/社团名称"
                align="center"
                width="300"
              />
              <el-table-column
                property="department_name"
                label="学院名称"
                align="center"
                width="300"
              />
              <el-table-column
                property="total_num"
                label="总人数"
                align="center"
                width="150"
              />
              <el-table-column
                property="manager"
                label="负责人"
                align="center"
                width="150"
              />
              <!-- 编辑 启用/未启用 方法 -->
              <el-table-column label="启用/未启用" align="center" width="200">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.is_deleted"
                    size="small"
                    :active-value="1"
                    :inactive-value="0"
                    :before-change="() => handleSwitchChange2CheckDelete(scope.row)"
                  />
                </template>
              </el-table-column>
              <!-- 编辑 正在招新/终止招新 方法 -->
              <el-table-column label="正在招新/终止招新" align="center" width="200">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.state"
                    size="small"
                    :active-value="1"
                    :inactive-value="0"
                    :before-change="() => handleSwitchChange2CheckAdd(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column>
                <template #default="scope">
                  <div>测试</div>
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
      <!-- 弹出处理 正在招新/终止招新 状态修改的对话框 -->
      <el-dialog v-model="dialogAdded" title="修改基地招新状态" width="500">
        <span>请确认要修改状态</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogAdded = false">取消</el-button>
            <el-button type="primary" @click="handleConfirmAdded"> 确认 </el-button>
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
#search div {
  display: flex;
  align-items: center;
  margin-right: 20px;
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
  justify-content: right;
}
#table {
  background: red;
}
.table-container:deep() .el-card__header {
  padding: 10px;
}
.table-container:deep() .el-card__body {
  padding: 0px;
  /* padding-top: 0px;
  padding-bottom: 0px; */
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
/* 修复el-switch按钮撑大行外间距导致的UI异常 */
/* TODO: 这个无法完全修复，再切换路由时样式会复原，现解决办法是将el-switch设置为small */
.table-container:deep() .el-table_1_column_6 {
  padding: 0px !important;
}
.table-container:deep() .el-table_1_column_7 {
  padding: 0px !important;
}
/* 修复el-switch按钮撑大行外间距导致的UI异常 */
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
</style>
