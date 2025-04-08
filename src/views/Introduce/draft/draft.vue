<script setup lang="ts">
import { message } from "@/utils/message";
import { ref, reactive, onMounted, computed } from "vue";
import useStore from "@/store";
import { useRole } from "./hook.tsx";
import noticeApi from "@/api/announcement";
import { PureTableBar } from "@/components/PureTableBar";
import { Download, Delete } from "@element-plus/icons-vue";
import { exportExcel } from "@/utils/export.ts";

const { loadingConfig, openDialog, draftColumns } = useRole();
const emit = defineEmits(["updateDraft"]);

const club_id = computed(() => useStore.clubStore.getCurrentClub().club_id);
const loading = ref(true);
const dataList = ref([]);

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true,
});

const exportFile = () => {
  exportExcel(draftColumns, dataList.value, "draft-list");
};

const getAllDraft = async () => {
  loading.value = true;
  await noticeApi
    .getIntroduceDraft(club_id.value, pagination.currentPage, pagination.pageSize)
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
  getAllDraft();
});

const delDraft = (draftId) => {
  noticeApi
    .delDraft(draftId)
    .then(() => {
      message("删除成功", { type: "success" });
      getAllDraft();
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const delAllDraft = () => {
  noticeApi
    .delAllDraft(club_id.value)
    .then(() => {
      message("清空草稿箱成功", { type: "success" });
      dataList.value = [];
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const updateDraft = (draftId) => {
  emit("updateDraft", draftId);
};
</script>

<template>
  <PureTableBar :columns="draftColumns" @refresh="getAllDraft" title="草稿箱">
    <template #right>
      <el-popconfirm title="是否确认清空草稿箱?" @confirm="delAllDraft()">
        <template #reference>
          <el-button class="reset-margin" type="danger" :icon="Delete" v-ripple>
            一键清空
          </el-button>
        </template>
      </el-popconfirm>
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
        @page-size-change="getAllDraft"
        @page-current-change="getAllDraft"
      >
        <template #operation="{ row }">
          <el-button
            class="reset-margin"
            type="primary"
            :size="size"
            @click="openDialog('查看草稿公告详情', row.draft_id)"
            v-ripple
          >
            查看详情
          </el-button>
          <el-button
          v-ripple
            class="reset-margin"
            type="primary"
            plain
            :size="size"
            @click="updateDraft(row.draft_id)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="是否确认删除?"
            @confirm="delDraft(row.draft_id)"
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
