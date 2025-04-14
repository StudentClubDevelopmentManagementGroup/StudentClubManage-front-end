<script setup lang="ts">
import { type PropType, ref, computed, watch, nextTick } from "vue"; // 新增 watch 和 nextTick
import { useDark, useECharts } from "@pureadmin/utils";

const props = defineProps({
  data: {
    type: Array as PropType<Array<number>>,
    default: () => []
  },
  color: {
    type: String,
    default: "#41b6ff"
  }
});

const { isDark } = useDark();
const theme = computed(() => (isDark.value ? "dark" : "light"));

const chartRef = ref();
const { setOptions } = useECharts(chartRef, {
  theme,
  renderer: "svg"
});

// 封装图表配置逻辑
const updateChart = () => {
  setOptions({
    container: ".line-card",
    xAxis: {
      type: "category",
      show: false,
      data: props.data
    },
    grid: {
      top: "15px",
      bottom: 0,
      left: 0,
      right: 0
    },
    yAxis: {
      show: false,
      type: "value"
    },
    series: [
      {
        data: props.data,
        type: "line",
        symbol: "none",
        smooth: true,
        color: props.color,
        lineStyle: {
          shadowOffsetY: 3,
          shadowBlur: 7,
          shadowColor: props.color
        }
      }
    ]
  });
};

// 初始化时创建图表
updateChart();

// 监听数据变化并更新图表
watch(
  () => [props.data, props.color], // 同时监听数据和颜色变化
  async () => {
    await nextTick(); // 等待DOM更新
    updateChart();
  },
  { deep: true }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 60px" />
</template>
