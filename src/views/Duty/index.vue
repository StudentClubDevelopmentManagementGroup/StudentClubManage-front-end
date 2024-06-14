<script setup lang="ts">
import { ref, h, toRaw, reactive, onMounted, computed } from "vue";
import useStore from "@/store";
import { useRenderIcon } from "@/components/Icon/hooks";
import { useRole } from "./group/hook";
import { exportExcel } from "@/utils/export.ts";
import dutyApi from "@/api/duty";
import { PureTableBar } from "@/components/PureTableBar";
import type { PaginationProps } from "@pureadmin/table";
import { message } from "@/utils/message";
import DutyList from "./duty/duty-list.vue";
import GroupList from "./group/group-list.vue";

const { columns, loadingConfig, openDialog } = useRole();

const loading = ref(true);
const dataList = ref([]);
const selected = ref("0");
const formRef = ref();
const club_id = computed(() => useStore.userStore.getClubId);
const query = ref({
  club_id: club_id.value,
  number: "",
  name: "",
  page_num: 1,
  page_size: 10,
});

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true,
});

const exportFile = () => {
  exportExcel(columns, dataList, "duty-list");
};

const getDutyData = async () => {
  loading.value = true;
  await dutyApi
    .getAllDuty(query.value)
    .then((data) => {
      pagination.total = data.total_item;
      pagination.pageSize = data.page_size;
      pagination.currentPage = data.current_page;
      dataList.value = data.records;
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

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  getDutyData();
};

const delDuty = (row) => {
  const req = {
    date_time: row.date_time,
    cleaner_id: row.cleaner_id,
    club_id: club_id.value,
  };
  dutyApi
    .delDuty(req)
    .then((data) => {
      message("删除成功", { type: "success" });
    })
    .catch((e) => {
      console.error(e.message);
    });
};
</script>

<template>
  <div class="main">
    <el-tabs v-model="selected" class="duty">
      <el-tab-pane  name="0">
        <template #label>
          <span>值日表</span>
        </template>
      </el-tab-pane>
      <el-tab-pane  name="1">
        <template #label>
          <span>值日小组</span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <DutyList v-if="selected == '0'" />
    <GroupList v-if="selected == '1'" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__nav-wrap)::after {
  height: 1px;
}

:deep(.el-tabs__header) {
  margin-top: 10px;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

:deep(.el-tabs__nav-next.is-disabled),
:deep(.el-tabs__nav-prev.is-disabled) {
  opacity: 0.5;
}
</style>
