<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { compile } from "path-to-regexp";
import { useRoute, useRouter } from "vue-router";

const levelList = ref([]);
const route = useRoute();
const router = useRouter();

// 获取面包屑
const getBreadcrumb = () => {
  const matched = route.matched.filter((item) => item?.meta?.title);
  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.children?.length !== 1
  );
};

const pathCompile = (path) => {
  const { params } = route;
  const toPath = compile(path);
  return toPath(params);
};

const handleLink = (item) => {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect);
  }
  router.push(pathCompile(path));
};

onMounted(() => {
  getBreadcrumb();
});

watch(
  () => route.path,
  () => {
    getBreadcrumb();
  },
  {
    deep: true,
  }
);
</script>

<template>
  <el-breadcrumb class="app-breadcremb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.navbar .breadcrumb-container {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
