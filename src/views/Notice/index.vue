<script setup lang="ts">
import { ref, h, toRaw, reactive, onMounted, computed } from "vue";
import RichEditor from "@/components/Editor/richEditor.vue";
import useStore from "@/store";
import { useRole } from "./hook";
import noticeApi from "@/api/announcement";
import { PureTableBar } from "@/components/PureTableBar";
import { useRenderIcon } from "@/components/Icon/hooks";
import Draft from "./draft/draft.vue";
import {
  CirclePlus,
  Delete,
  Download,
  Upload,
  Refresh,
} from "@element-plus/icons-vue";
import { exportExcel } from "@/utils/export.ts";
import formatUtil from "@/utils/formatter";
import { message } from "@/utils/message";
const { noticeColumns, loadingConfig, openDialog } = useRole();

const club_id = computed(() => useStore.userStore.getClubId);
const selectedTime = ref([
  formatUtil.formatDate3(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
  formatUtil.formatDate3(new Date().getTime()),
]);
const selected = ref(0);
const loading = ref(true);
const editorValue = ref("");
const richHtml = ref();
const dataList = ref([]);
const formRef = ref();
const query = ref({
  club_id: club_id.value,
  author_name: "",
  title_keyword: "",
  from_date: "",
  to_date: "",
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
  exportExcel(noticeColumns, dataList, "notice-list");
};

const getNoticeData = async () => {
  loading.value = true;
  await noticeApi
    .getAllNotice(query.value)
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
    })
    .catch((e) => {
      console.error(e.message);
    });
};
const handleUpdateValue = (val: any) => {
  richHtml.value = val;
};
function tabClick({ index }) {
  console.log(index);

  selected.value = index;
}
function handleSizeChange(val: number) {
  query.value.page_size = val;
  getNoticeData();
}

function handleCurrentChange(val: number) {
  query.value.page_num = val;
  getNoticeData();
}
const handleTimeChange = (val) => {
  query.value.from_date = val[0];
  query.value.to_date = val[1];
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  getNoticeData();
};
</script>

<template>
  <div class="main">
    <el-card shadow="never" class="!p-5">
      <el-tabs @tab-click="tabClick">
        <el-tab-pane :lazy="true">
          <template #label>
            <span>编辑公告</span>
          </template>
        </el-tab-pane>
        <el-tab-pane :lazy="true">
          <template #label>
            <span>所有公告</span>
          </template>
        </el-tab-pane>
        <el-tab-pane :lazy="true">
          <template #label>
            <span>草稿箱</span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div v-if="selected == 0">
        <el-form
          :inline="true"
          :model="query"
          class="search-form bg-bg_color w-[99/100] overflow-auto my-4"
        >
          <el-input
            v-model="query.title_keyword"
            placeholder="请输入标题"
            clearable
            show-word-limit
            maxlength="30"
            type="text"
            class="!w-[690px] !h-[55px] !text-xl"
          />
        </el-form>
        <RichEditor
          :model-value="editorValue"
          @update:modelValue="handleUpdateValue"
          placeholder="请输入正文..."
        ></RichEditor>
      </div>
      <div v-if="selected == 1">
        <el-form
          ref="formRef"
          :inline="true"
          :model="query"
          class="search-form bg-bg_color w-[99/100] pl-4 pt-[12px] pb-[4px] overflow-auto"
        >
          <el-form-item label="姓名" prop="author_name" class="!mb-0">
            <el-input
              v-model="query.author_name"
              placeholder="请输入姓名"
              clearable
              class="!w-[160px]"
            />
          </el-form-item>
          <el-form-item label="标题" prop="title_keyword" class="!mb-0">
            <el-input
              v-model="query.title_keyword"
              placeholder="请输入标题"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
          <el-form-item label="时间范围" prop="department_id" class="!mb-0">
            <el-date-picker
              v-model="selectedTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleTimeChange"
            />
          </el-form-item>
          <el-form-item class="!mb-0">
            <el-button
              type="primary"
              :icon="useRenderIcon('ri:search-line')"
              :loading="loading"
              @click="getNoticeData"
            >
              搜索
            </el-button>
            <el-button :icon="Refresh" @click="resetForm(formRef)">
              重置
            </el-button>
          </el-form-item>
        </el-form>
        <PureTableBar
          :columns="noticeColumns"
          @refresh="getNoticeData"
          title="公告表"
        >
          <template #right>
            <el-button type="primary" @click="exportFile" :icon="Download">
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
                  @click="openDialog('查看详情', row.announcement_id)"
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
                >
                  移入草稿箱
                </el-button>
                <el-popconfirm
                  title="是否确认删除?"
                  @confirm="delNotice(row.announcement_id)"
                >
                  <template #reference>
                    <el-button class="reset-margin" type="danger" :size="size">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
      <div v-if="selected == 2">
        <Draft />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
