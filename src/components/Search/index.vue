<template>
  <div id="Serach" class="search-container">
    <el-select
      v-model="state.value"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="请输入关键字搜索"
      @change="handleChange"
    >
      <template #prefix>
        <IconifyIconOffline
          :icon="Search"
          width="14"
          class="cursor-pointer text-gray-500 hover:text-blue-400"
        />
      </template>
      <el-option
        v-for="{ item } in state.options"
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
import { usePermissionStore } from "@/store/permission";

import Search from "@iconify-icons/ri/search-line";

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

const generateList = (routers, basePath = "/", prefixTitle = []) => {
  let list = [];
  for (const route of routers) {
    if (!route?.meta?.hidden) {
      const data = {
        path: path.resolve(basePath, route.path),
        title: [...prefixTitle],
      };
      if (route?.meta?.title) {
        data.title = [...data.title, route.meta.title];
      }
      if (route.children) {
        if (route.children.length === 1 && !route.children[0].children) {
          // 当只有一个子路由且该子路由没有自己的子路由时，直接使用父路由的路径和标题
          data.path = path.resolve(data.path, route.children[0].path);
          list.push(data);
        } else {
          // 否则，递归生成子路由列表
          const childList = generateList(route.children, data.path, data.title);
          list = [...list, ...childList];
        }
      } else {
        list.push(data);
      }
    }
  }
  console.log(list);
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
.search-container {
  width: 200px;
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
