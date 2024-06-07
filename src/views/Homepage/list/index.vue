<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useColumns } from "./hook.tsx";
import constants from "@/config";
import useStore from "@/store";

import { Search, Refresh } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

const options = computed(() => useStore.departmentStore.getOptions());
const searchParams = computed(() => useStore.homepageStore.getTitleKeyword());

const {
  tableData,
  tableRef,
  formRef,
  tableLoading,
  btnLoading,
  query,
  pagination,
  columns,
  loadingConfig,

  fetchTableData,
  onLoading,
  onSizeChange,
  onCurrentChange,
  handleSearch,
  handleReset,
} = useColumns();

watch(searchParams, () => {
  onLoading();
  fetchTableData();
});

onMounted(() => {
  onLoading();
  fetchTableData();
  useStore.departmentStore.getOptionsList();
});
</script>

<template>
  <div class="container-width m-auto">
    <div class="wrapper grid mt-4 mb-4">
      <div class="search-container pt-5 pb-5 pr-5">
        <el-affix>
          <el-card>
            <el-form ref="formRef" :model="query" class="pt-4 pr-4 pl-4">
              <el-form-item label="社团" prop="club_name">
                <el-input
                  v-model="query.club_name"
                  placeholder="请输入查询社团"
                  clearable
                />
              </el-form-item>

              <el-form-item label="作者" prop="author_name">
                <el-input
                  v-model="query.author_name"
                  placeholder="请输入文章作者"
                  clearable
                />
              </el-form-item>

              <el-form-item class="items-center" label="学院" prop="department_id">
                <el-select
                  v-model="query.department_id"
                  placeholder="请选择学院名称"
                  class=""
                >
                  <el-option
                    v-for="item in options"
                    :label="item.fullName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <div class="w-full text-center">
                  <el-button
                    v-ripple
                    type="primary"
                    :icon="Search"
                    @click="handleSearch"
                    :loading="btnLoading"
                    >查询</el-button
                  >
                  <el-button :icon="Refresh" v-ripple @click="handleReset"
                    >重置</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-affix>
      </div>
      <div class="list-container p-5">
        <el-card class="!border-1 !border-gray-300" shadow="never">
          <template #header> 相关资讯 </template>
          <pure-table
            ref="tableRef"
            row-key="id"
            table-layout="auto"
            :loading="tableLoading"
            border
            :columns="columns"
            :data="tableData"
            :loading-config="loadingConfig"
            :pagination="pagination"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)',
            }"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
          >
            <template #myRow="{ row }">
              <div class="flex-col text-left">
                <el-text
                  class="w-full !text-black !font-semibold !text-lg"
                  line-clamp="1"
                >
                  <a
                    :href="
                      constants.serverUrl +
                      '#/homepage/detail?announcementId=' +
                      row.announcement_id
                    "
                    >{{ row.title }}</a
                  >
                </el-text>
                <el-text class="w-full !text-sm !text-gray-400" line-clamp="1">
                  <span class="mr-2">发布时间：{{ row.publish_time }}</span>
                  <span class="mr-2">学院: {{ row.department_name }}</span>
                </el-text>
                <el-text class="w-full !text-sm !text-gray-400" line-clamp="1">
                  <span class="mr-2">社团: {{ row.club_name }}</span>
                  <span class="mr-2">作者：{{ row.author_name }}</span>
                </el-text>

                <el-text class="!text-base" line-clamp="3">
                  {{ row.summary }}
                </el-text>
              </div>
            </template>
          </pure-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  min-height: 632px;
  display: grid;
  grid-template-columns: 980px 1fr;
  grid-template-areas: "left right";

  .search-container {
    grid-area: right;
  }

  .list-container {
    grid-area: left;

    ::v-deep(.el-card__header) {
      padding: 10px;
    }

    ::v-deep(.el-pagination) {
      padding-right: 20px;
    }
  }
}
</style>
