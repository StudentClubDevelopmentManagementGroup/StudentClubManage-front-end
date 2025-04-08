<script setup lang="ts">
import { ref, h, toRaw, reactive, onMounted, computed } from "vue";
import useStore from "@/store";
import { useRole } from "./hook.tsx";
import noticeApi from "@/api/announcement";
import { PureTableBar } from "@/components/PureTableBar";
import { useRenderIcon } from "@/components/Icon/hooks";
import { Download, Refresh } from "@element-plus/icons-vue";
import { exportExcel } from "@/utils/export";
import { message } from "@/utils/message";
import formatUtil from "@/utils/formatter";

const { noticeColumns, loadingConfig, openDialog } = useRole();

const club_id = computed(() => useStore.clubStore.getCurrentClub().club_id);

const loading = ref(true);
const dataList = ref([]);
const query = ref({
  club_id: club_id.value,
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
  exportExcel(noticeColumns, dataList.value, "notice-list");
};

const getNoticeData = async () => {
  loading.value = true;
  await noticeApi
    .getIntroduceNotice(query.value)
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

onMounted(() => {
  getNoticeData();
});

const noticeToDraft = (announcementId) => {
  noticeApi
    .noticeToDraft(announcementId)
    .then(() => {
      message("移入草稿箱成功", { type: "success" });
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const delNotice = (announcementId) => {
  noticeApi
    .delNotice(announcementId)
    .then(() => {
      message("删除成功", { type: "success" });
      getNoticeData();
    })
    .catch((e) => {
      console.error(e.message);
    });
};

function handleSizeChange(val: number) {
  query.value.page_size = val;
  getNoticeData();
}

function handleCurrentChange(val: number) {
  query.value.page_num = val;
  getNoticeData();
}
</script>

<template>
  <PureTableBar
    :columns="noticeColumns"
    @refresh="getNoticeData"
    title="公告表"
  >
    <template #right>
      <el-button type="primary" @click="exportFile" :icon="Download" v-ripple>
        导出
      </el-button>
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        ref="tableRef"
        row-key="user_id"
        align-whole="center"
        showOverflowTooltip
        table-layout="auto"
        :loading="loading"
        :size="size"
        border
        :data="dataList"
        :loading-config="loadingConfig"
        :columns="dynamicColumns"
        :pagination="pagination"
        :paginationSmall="size === 'small' ? true : false"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
        }"
        @page-size-change="handleSizeChange"
        @page-current-change="handleCurrentChange"
      >
        <template #operation="{ row }">
          <el-button
            class="reset-margin"
            type="primary"
            :size="size"
            @click="openDialog('查看公告详情', row.announcement_id)"
            v-ripple
          >
            查看详情
          </el-button>
          <el-button
            class="reset-margin"
            type="primary"
            plain
            :size="size"
            v-tippy="{
              content: '移入草稿箱才能编辑公告',
              theme: 'light',
              hideOnClick: 'toggle',
              placement: 'top',
            }"
            @click="noticeToDraft(row.announcement_id)"
            v-ripple
          >
            移入草稿箱
          </el-button>
          <el-popconfirm
            title="是否确认删除?"
            @confirm="delNotice(row.announcement_id)"
          >
            <template #reference>
              <el-button class="reset-margin" type="danger" :size="size" v-ripple>
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </pure-table>
    </template>
  </PureTableBar>
</template>

<style lang="scss" scoped></style>
