<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import useStore from "@/store";
import type { PaginationProps } from "@pureadmin/table";
import { useRenderIcon } from "@/components/Icon/hooks";
import formatUtil from "@/utils/formatter";

import { Refresh } from "@element-plus/icons-vue";

const loading = ref(true);
const formRef = ref();
const club_id = computed(() => useStore.userStore.getClubId);

const query = ref({
  clubId: club_id.value,
  name: null,
  startTime: formatUtil.formatDate2(
    new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  ),
  endTime: formatUtil.formatDate2(new Date()),
  currentPage: 1,
  pageSize: 10,
});

const selectedTime = ref([
  formatUtil.formatDate2(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  formatUtil.formatDate2(new Date().getTime()),
]);

const handleTimeChange = (val) => {
  console.log(val);
};
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="query"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="query.name"
          placeholder="请输入姓名"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="时间范围" prop="department_id">
        <el-date-picker
          v-model="selectedTime"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleTimeChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
        >
          搜索
        </el-button>
        <el-button :icon="Refresh"> 重置 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
