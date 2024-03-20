<script setup>
import { reactive, ref, watch, toRaw, computed } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { getBaseList } from "@/api/admin-management";

const input1 = ref("");
const input2 = ref("");

const multipleSelection = ref([]);
const tableData = [
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
  {
    club_name: "名字",
    department_name: "计算机与信息安全学院",
    total_num: "10",
    manager: "赵三",
    is_deleted: 0,
    state: 0,
  },
];

const handleSearch = () => {
  console.log("这是检索操作", "基地：" + input1.value, "院系：" + input2.value);
};
const handleReset = () => {
  input1.value = "";
  input2.value = "";
  console.log("这是重置操作");
};

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};

const data = ref(null);

// getBaseList()
//   .then((response) => {
//     console.log("response", response);
//   })
//   .catch((err) => {
//     console.warn(err);
//   });
</script>

<template>
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
          <!-- 值框 -->
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
            <el-button
              type="primary"
              style="margin-right: 10px"
              @click="handleSearch"
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
            <el-button type="primary" :icon="CirclePlus">新增</el-button>
          </div>
        </template>
        <!-- 数据表格 -->
        <div id="table">
          <el-table
            ref="TableRef"
            :data="tableData"
            border
            height="545"
            table-layout="auto"
            size="large"
          >
            <el-table-column type="selection" align="center" />
            <el-table-column
              property="club_name"
              label="基地/社团名称"
              align="center"
            />
            <el-table-column
              property="department_name"
              label="学院名称"
              align="center"
            />
            <el-table-column
              property="total_num"
              label="总人数"
              align="center"
            />
            <el-table-column property="manager" label="负责人" align="center" />
            <el-table-column
              property="is_deleted"
              label="启用/未启用"
              align="center"
            />
            <el-table-column
              property="state"
              label="正在招新/终止招新"
              align="center"
            />
            <el-table-column width="200">
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
                :small="small"
                :disabled="disabled"
                :background="background"
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
  </div>
</template>

<style scoped>
#container {
  display: grid;
  grid-template-rows: 175px auto; /* 上块高度为150px，下块高度自适应 */
}
/* 检索关键字区域样式 */
#up-container {
  display: flex;
  justify-content: center;
  align-items: center;
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 40px;
}
.table-container {
  width: 100%;
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
