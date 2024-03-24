<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { isUrl } from "@pureadmin/utils";
import sidebarItem from "./sidebarItem.vue";
import LeftCollapse from "./leftCollapse.vue";
import logo from "./logo.vue";
import useStore from "@/store";
import { getConfig } from "@/config";

const route = useRoute();

const isCollapse = computed(() => !useStore.appStore.getSidebarOpened);
const showLogo = computed(() => useStore.settingStore.getShowLogo);
const routes = computed(() => useStore.permissionStore.accessRoutes);
const activeMenu = computed(() => useStore.tabStore.getCurrentIndex);
const tooltipEffect = computed(() => {
  getConfig().TooltipEffect;
});

onMounted(() => {
  const routePath = route.path;
  console.log(routePath);
  useStore.tabStore.setCurrentIndex(routePath);
});

const resolvePath = (routePath) => {
  if (isUrl(routePath)) {
    return routePath;
  }
};

const toggleSideBar = () => {
  useStore.appStore.toggle_sidebar();
};
</script>

<template>
  <div
    v-loading="loading"
    :class="['sidebar-container', showLogo ? 'has-logo' : 'no-logo']"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" class="pc">
      <el-menu
        router
        unique-opened
        mode="vertical"
        popper-class="pure-scrollbar"
        class="outer-most select-none"
        :collapse="isCollapse"
        :popper-effect="tooltipEffect"
        :default-active="activeMenu"
      >
        <!--递归路由对象-->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          class="outer-most select-none"
        />
      </el-menu>
    </el-scrollbar>
    <leftCollapse :is-active="!isCollapse" @toggleClick="toggleSideBar" />
  </div>
</template>

<style scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
