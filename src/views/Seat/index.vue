<script setup lang="ts">
import { reactive, ref } from "vue";
import Seat from "./seat.vue";

type ExamSiteType = {
  coordinateX: number; //x坐标位置
  coordinateY: number; //y坐标位置
  seatNo: number; //座位号  == 如果没有赋值为无座
  seatId: "" | number; //真实的考试机器坐标位置
  status?: number; //座位考试状态  被举报 异常 死机等
};
const taskList = reactive([
  { title: "meet manger", classNames: "bg-danger", id: "1" },
  { title: "interview for front-end", classNames: "bg-success", id: "2" },
  { title: "studying", classNames: "bg-info", id: "3" },
  { title: "dead line ", classNames: "bg-warning", id: "4" },
  { title: "go to sleep", classNames: "bg-dark", id: "5" },
]);

// 数据源1
const datas = ref<Array<ExamSiteType>>([]);
  const examsits = ref([])
// 初始化 数据源 如8行8列 总机考数 16台
function initExamData() {
  const row: number = 8;
  const column = 8;
  const total = 64;
  examsits.value = [];
  let i = 0;
  for (let x = 0; x < row; x++) {
    for (let y = 0; y < column; y++) {
      if (i < total) {
        datas.value.push({
          coordinateX: x,
          coordinateY: y,
          seatNo: i + 1,
          seatId: "",
        });
        i++;
      }
    }
  }
}
initExamData();
</script>

<template>
  <div class="main">
    <el-card>
      <el-row>
        <el-col :span="4">
          <div ref="containerRef">
            <div
              v-for="item in taskList"
              :key="item.id"
              class="external-events"
              :class="[item.classNames]"
            >
              <i class="list-circle"></i>{{ item.title }}
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <Seat :items="datas" :type="2"></Seat>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
