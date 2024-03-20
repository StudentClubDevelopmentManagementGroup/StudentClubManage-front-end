<template>
  <div id="Serach" class="search-container">
    <el-select
      v-model="value"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="请输入关键字搜索"
      @change="handleChange"
    >
      <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
      <el-option
        v-for="{ item } in options"
        :key="item.path"
        :value="item"
        :label="item.title.join(' > ')"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import Fuse from "fuse.js";
import path from "path-browserify";
import { useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { usePermissionStore } from "@/store/permission";

const permissionStore = usePermissionStore();
const router = useRouter();
const fuse = ref<Fuse<dataType>>();
const routes = computed(() => permissionStore.accessRoutes);

interface dataType {
  path: string;
  title: string[];
}

const state = ref({
  options: [],
  value: "",
});

const config = {
  shouldSort: true,
  threshold: 0.7,
  location: 0,
  distance: 150,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {
      name: "title",
      weight: 0.7,
    },
    {
      name: "path",
      weight: 0.3,
    },
  ],
};

const querySearch = (query: string) => {
  if (query !== "") {
    state.value.options = fuse.value.search(query);
  } else {
    state.value.options = [];
  }
};

const generateList = (
  routers: any,
  basePath = "/",
  prefixTitle: string[] = []
) => {
  let list: dataType[] = [];
  for (const route of routers) {
    if (!route?.meta?.hidden) {
      const data: dataType = {
        path: path.resolve(basePath, route.path),
        title: [...prefixTitle],
      };
      if (route?.meta?.title) {
        data.title = [...data.title, route.meta.title];
        list.push(data);
      }
      if (route.children) {
        const childList = generateList(route.children, data.path, data.title);
        list = [...list, ...childList];
      }
    }
  }
  return list;
};

const handleChange = (val: { path: string }) => {
  router.push(val.path);
  state.value.value = "";
  state.value.options = [];
};

watchEffect(() => {
  const searchList = generateList(routes.value);
  fuse.value = new Fuse(searchList, config);
});
</script>

<style lang="scss" scoped>
.search-container{
  :deep(.el-input__inner) {
    border-radius: 0;
    border: 0;
    padding-left: 0;
    padding-right: 0;
    box-shadow: none !important;
    border-bottom: 1px solid #d9d9d9;
    vertical-align: middle;
  }
}
</style>
