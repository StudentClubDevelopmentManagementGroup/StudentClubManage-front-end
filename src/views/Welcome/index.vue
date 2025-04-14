<script setup>
import { ref, h, toRaw, reactive, onMounted, computed } from "vue";
import { useRoute } from 'vue-router';
import { chartData, barChartData } from "./data";
import ReCol from "@/components/ReCol";
import lineChart from "./components/line.vue";
import barChart from "./components/bar.vue";
import roundChart from "./components/round.vue";
import announcementApi from "@/api/ai.js";
import useStore from "@/store";

// 响应式数据
const aiAnswer = ref('');
const loading = ref(false);

const clubStore = useStore.clubStore;
const club_id = computed(() => clubStore.getCurrentClub().club_id);
// 使用计算属性获取club_id

// 获取AI分析报告
const fetchAIData = async () => {
  try {
    if (!club_id.value) {
      console.error('未获取到有效的基地ID');
      return;
    }
    
    loading.value = true;
    const data = await announcementApi.getAnalyse(club_id.value); // 传递实际值
    
    // 安全更新基础数据
    if (data?.ann) {
      chartData[2].value = data.ann.thisMonthNum || 0;
      chartData[2].percent = calculatePercent(
        data.ann.thisMonthNum,
        data.ann.lastMonthNum
      );
    }
    // 更新签到数据
    if (data?.att_list) {
      const sortedAtt = [...data.att_list].sort((a, b) => a.day_of_week - b.day_of_week);
      console.log(data.att_list);
      chartData[1].data = sortedAtt.map(item => item.tnum || 0);
      console.log(chartData);

    }
    // 设置AI回答
    aiAnswer.value = data?.message?.replace(/\n/g, '\n\n') || '暂无分析结果';
  } catch (error) {
    console.error('获取AI数据失败:', error);
    aiAnswer.value = '分析报告生成失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};
// 计算百分比变化（添加除零保护）
const calculatePercent = (current, previous) => {
  if (!previous || previous === 0) return 'N/A';
  const change = ((current - previous) / previous * 100).toFixed(0);
  return `${change > 0 ? '+' : ''}${change}%`;
};
// 组件挂载时获取数据
onMounted(() => {
  if (club_id.value) {
    fetchAIData();
  } else {
    console.warn('未找到有效的俱乐部信息');
  }
});
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
              :initial="{
                opacity: 0,
                y: 100,
              }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 80 * (index + 1),
                },
              }"
            >
              <el-card class="line-card p-3" shadow="never" >
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
      <!-- 分析概览图表 -->
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
      <!-- 新增AI分析结果 -->
      <re-col class="mb-[18px]" :value="24" :xs="24">
        <el-card 
          class="ai-card p-6" 
          shadow="never" 
          v-loading="loading"
          element-loading-text="AI正在分析中..."
        >
          <div class="flex justify-between mb-4">
            <span class="text-md font-medium">AI分析报告</span>
            <el-tag type="success" effect="plain">实时分析</el-tag>
          </div>
          <div 
            class="ai-content bg-gray-50 p-4 rounded-md max-h-[400px] overflow-y-auto"
            :style="{ whiteSpace: 'pre-wrap' }"
          >
            {{ aiAnswer }}
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
