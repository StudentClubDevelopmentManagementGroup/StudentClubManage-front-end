<script setup lang="ts">
import { ref, h, toRaw, reactive, onMounted, computed } from "vue";
import useStore from "@/store";
import dutyApi from "@/api/duty";
import Card from "./Card.vue";

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

const total = ref(0)
const loading = ref(true);
const dataList = ref([]);
const club_id = computed(() => useStore.clubStore.getCurrentClub().club_id);
const query = ref({
  club_id: club_id.value,
  page_num: 1,
  page_size: 6,
});

const getDutyData = async () => {
  loading.value = true;
  await dutyApi
    .getSelfDuty(query.value)
    .then((data) => {
      total.value = data.total_item;
      query.value.page_size = data.page_size;
      query.value.page_num = data.current_page;
      dataList.value = data.records;
      if (!data.records) {
        dataList.value = []
      }
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
</script>

<template>
  <div
    v-loading="loading"
    :element-loading-svg="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <el-empty v-show="dataList.length === 0" description="无值日安排" />
    <template v-if="total > 0">
      <el-row :gutter="16">
        <el-col
          v-for="(duty, index) in dataList"
          :key="index"
          :md="12"
          :lg="8"
          :xl="6"
        >
          <Card :duty="duty" />
        </el-col>
      </el-row>
      <el-pagination
          v-model:currentPage="query.page_num"
          class="float-right"
          :page-size="query.page_size"
          :total="total"
          :page-sizes="[6, 12, 24]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
    </template>
  </div>
</template>
