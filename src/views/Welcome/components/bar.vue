<script setup lang="ts">
import { useDark, useECharts } from "@pureadmin/utils";
import { type PropType, ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  requireData: {
    type: Array as PropType<Array<number>>,
    default: () => [],
  },
  questionData: {
    type: Array as PropType<Array<number>>,
    default: () => [],
  },
});

const { isDark } = useDark();

const theme = computed(() => (isDark.value ? "dark" : "light"));

const chartRef = ref();
const { setOptions } = useECharts(chartRef, {
  theme,
});

watch(
  () => props,
  async () => {
    await nextTick(); // 确保DOM更新完成后再执行
    setOptions({
      container: ".bar-card",
      color: ["#41b6ff", "#e85f33"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "none",
        },
      },
      grid: {
        top: "20px",
        left: "50px",
        right: 0,
      },
      legend: {
        data: ["用户人数", "签到数量"],
        textStyle: {
          color: "#606266",
          fontSize: "0.875rem",
        },
        bottom: 0,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "上周一",
            "上周二",
            "上周三",
            "上周四",
            "上周五",
            "上周六",
            "上周日",
            "本周一",
            "本周二",
            "本周三",
            "本周四",
            "本周五",
            "本周六",
            "本周日",
          ],
          axisLabel: {
            fontSize: "0.875rem",
          },
          axisPointer: {
            type: "shadow",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            fontSize: "0.875rem",
          },
          splitLine: {
            show: false, // 去网格线
          },
          // name: "单位: 个"
        },
      ],
      series: [
        {
          name: "用户人数",
          type: "bar",
          barWidth: 20,
          itemStyle: {
            color: "#41b6ff",
            borderRadius: [5, 5, 0, 0],
          },
          data: props.requireData,
        },
        {
          name: "签到数量",
          type: "bar",
          barWidth: 20,
          itemStyle: {
            color: "#e86033ce",
            borderRadius: [5, 5, 0, 0],
          },
          data: props.questionData,
        },
      ],
    });
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 365px" />
</template>
