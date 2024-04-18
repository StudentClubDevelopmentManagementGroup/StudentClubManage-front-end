<script setup>
const props = defineProps({
  nodeData: {
    type: Object,
    default: {
      x: 0,
      y: 0,
      properties: {
        user_id: "无",
        name: "无",
        text: "无",
        arranger: {
          user_id: "无",
          name: "无",
        },
      },
    },
  },
});
</script>

<template>
  <el-descriptions direction="vertical" :column="3" border>
    <el-descriptions-item>
      <template #label>
        <div class="flex items-center">安排者学号</div>
      </template>
      {{ nodeData.properties.arranger.user_id }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="flex items-center">安排者姓名</div>
      </template>
      {{ nodeData.properties.arranger.name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">安排者身份</div>
      </template>
      <el-tag
        v-if="nodeData.properties.arranger.is_teacher"
        style="margin-left: 10px"
        type="primary"
        >教师</el-tag
      >
      <el-tag
        v-if="nodeData.properties.arranger.is_student"
        style="margin-left: 10px"
        type="success"
        >学生</el-tag
      >
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="flex items-center">拥有者学号</div>
      </template>
      {{ nodeData.properties.user_id ?? "无" }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="flex items-center">拥有者姓名</div>
      </template>
      {{ nodeData.properties.name ?? "无" }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">拥有者身份</div>
      </template>
      <el-tag
        v-if="nodeData.properties.is_teacher"
        style="margin-left: 10px"
        type="primary"
        >教师</el-tag
      >
      <el-tag
        v-if="nodeData.properties.is_student"
        style="margin-left: 10px"
        type="success"
        >学生</el-tag
      >
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="flex items-center">位置坐标(x,y)</div>
      </template>
      {{ nodeData.x }},{{ nodeData.y }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="flex items-center">座位描述</div>
      </template>
      {{ !nodeData.properties.text ? "空座" : nodeData.properties.text }}
    </el-descriptions-item>
  </el-descriptions>
</template>
