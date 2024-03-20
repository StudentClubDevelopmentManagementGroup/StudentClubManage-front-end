<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { isUrl } from "@pureadmin/utils";
import sidebarItem from "./sidebarItem.vue";
import logo from "./logo.vue";
import { usePermissionStore } from "@/store/permission";

const route = useRoute();
const permissionStore = usePermissionStore();
const isCollapse = computed(() => false);
const showLogo = computed(() => true);
const routes = computed(() => permissionStore.accessRoutes);
const activeMenu = computed(() => "/home");

console.log(routes.value);
onMounted(() => {
  const routePath = route.path;
});

const resolvePath = (routePath) => {
  if (isUrl(routePath)) {
    return routePath;
  }
};
</script>

<template>
  <div
    v-loading="loading"
    :class="['sidebar-container', showLogo ? 'has-logo' : 'no-logo']"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :router="true"
        :unique-opened="false"
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
      >
        <!--递归路由对象-->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <!-- <leftCollapse
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    /> -->
  </div>
</template>

<style scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}
</style>
