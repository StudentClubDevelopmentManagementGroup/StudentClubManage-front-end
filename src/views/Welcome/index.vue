<script setup>
import { chartData, barChartData } from "./data";
import ReCol from "@/components/ReCol";
import lineChart from "./line.vue";
import barChart from "./bar.vue";
import roundChart from "./round.vue";
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <re-col
        v-for="(item, index) in chartData"
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

      <re-col
        class="mb-[18px]"
        :value="24"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
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
    </el-row>
  </div>
</template>

<style lang="scss" scoped></style>
