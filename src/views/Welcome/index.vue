<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { chartData, barChartData } from "./data";
import ReCol from "@/components/ReCol";
import lineChart from "./components/line.vue";
import barChart from "./components/bar.vue";
import roundChart from "./components/round.vue";
import announcementApi from "@/api/ai.js";
import useStore from "@/store";

const aiAnswer = ref('');
const loading = ref(false);
const clubStore = useStore.clubStore;
const club_id = computed(() => clubStore.getCurrentClub().club_id);

const processData = (data: any) => {
  if (data?.user_yearly) {
    const yearly = data.user_yearly;
    chartData[0].value = yearly.tnum || 0;
    chartData[0].percent = calculatePercent(yearly.tnum, yearly.lnum);
  }
  if (data?.ann) {
    const ann = data.ann;
    chartData[2].value = ann.thisMonthNum || 0;
    chartData[2].percent = calculatePercent(ann.thisMonthNum, ann.lastMonthNum);
  }
  if (data?.att_list) {
    const sortedAtt = [...data.att_list].sort((a, b) => a.day_of_week - b.day_of_week);
    const sumTnum = sortedAtt.reduce((sum, item) => sum + (item.tnum || 0), 0);
    const sumLnum = sortedAtt.reduce((sum, item) => sum + (item.lnum || 0), 0);
    chartData[1].value = sumTnum;
    chartData[1].percent = calculatePercent(sumTnum, sumLnum);
    const lastWeekAtt = sortedAtt.map(item => item.lnum || 0);
    const thisWeekAtt = sortedAtt.map(item => item.tnum || 0);
    barChartData[0].questionData = [...lastWeekAtt, ...thisWeekAtt];
  }
  if (data?.user_list) {
    const sortedUser = [...data.user_list].sort((a, b) => a.day_of_week - b.day_of_week);
    const lastWeekUser = sortedUser.map(item => item.lnum || 0);
    const thisWeekUser = sortedUser.map(item => item.tnum || 0);
    barChartData[0].requireData = [...lastWeekUser, ...thisWeekUser];
  }
  aiAnswer.value = data?.message?.replace(/\n/g, '\n\n') || '暂无分析结果';
};

const fetchAIData = async () => {
  try {
    if (!club_id.value) return;
    loading.value = true;
    const data = await announcementApi.getData(club_id.value);
    processData(data);
  } catch (error) {
    console.error('获取数据失败:', error);
    aiAnswer.value = '数据加载失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

const fetchAIAnalyse = async () => {
  try {
    if (!club_id.value) return;
    loading.value = true;
    const data = await announcementApi.getAnalyse(club_id.value);
    processData(data);
  } catch (error) {
    console.error('实时分析失败:', error);
    aiAnswer.value = '实时分析失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

const calculatePercent = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? '0%' : '±∞%';
  const change = ((current - previous) / previous * 100).toFixed(0);
  return `${Number(change) > 0 ? '+' : ''}${change}%`;
};

onMounted(() => club_id.value && fetchAIData());
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <re-col
        v-for="(item, index) in chartData.slice(0, 3)"
        :key="index"
        class="mb-[18px]"
        :value="6"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{ opacity: 0, y: 100 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { delay: 80 * (index + 1) },
        }"
      >
        <el-card class="line-card p-3" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">
              {{ item.name }}
            </span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="item.bgColor"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <div class="w-1/2">
              <h3>{{ item.value }}</h3>
              <p class="font-medium text-green-500">{{ item.percent }}</p>
            </div>
            <lineChart
              v-if="item.data.length > 1"
              class="!w-1/2"
              :color="item.color"
              :data="item.data"
            />
            <roundChart v-else class="!w-1/2" :data="item.data" />
          </div>
        </el-card>
      </re-col>

      <re-col class="mb-[18px]" :value="24" :xs="24">
        <el-card class="bar-card p-6" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">分析概览</span>
          </div>
          <div class="flex justify-between items-start mt-3">
            <barChart
              :requireData="barChartData[0].requireData"
              :questionData="barChartData[0].questionData"
            />
          </div>
        </el-card>
      </re-col>

      <re-col class="mb-[18px]" :value="24" :xs="24">
        <el-card 
          class="ai-card p-6" 
          shadow="never" 
          v-loading="loading"
          element-loading-text="AI正在分析中..."
        >
          <div class="flex justify-between mb-4">
            <span class="text-md font-medium">AI分析报告</span>
            <el-button 
              type="success" 
              plain 
              @click="fetchAIAnalyse"
              :loading="loading"
            >
              实时分析
            </el-button>
          </div>
          <div 
            class="ai-content bg-gray-50 p-4 rounded-md max-h-[400px] overflow-y-auto"
            :style="{ whiteSpace: 'pre-wrap' }"
          >
            {{ aiAnswer.replace(/(#{2,})|\*{2,}|-{3,}/g, '').replace(/\n{3,}/g, '\n\n') }}
          </div>
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.ai-card {
  .ai-content {
    line-height: 1.8;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 
      'Microsoft YaHei', Arial, sans-serif;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }
  }
}
</style>
