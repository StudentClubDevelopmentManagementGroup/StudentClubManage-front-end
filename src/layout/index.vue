<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import Sidebar from "./components/sidebar/index.vue";
import Horizontal from "./components/sidebar/horizontal.vue";
import Navbar from "./components/Navbar.vue";
import AppMain from "./components/AppMain.vue";
import Tab from "./components/tab";
import Setting from "./components/setting";
import useStore from "@/store";

const showSetting = computed(() => useStore.settingStore.getShowSettings);
const opened = computed(() => useStore.appStore.getSidebarOpened);
const fixedHeader = computed(() => useStore.settingStore.getFixedHeader);
const hideHeader = computed(() => useStore.settingStore.getHideHeader);
const layout = computed(() => useStore.appStore.getLayout);
const hideTabs = computed(() => useStore.settingStore.getHideTabs);
const withoutAnimation = computed(
  () => useStore.appStore.getSidebarWithoutAnimation
);
const originalStylesheetCount = computed(
  () => document.styleSheets.length || -1
);
const classObj = computed(() => {
  return {
    hideSidebar: !useStore.appStore.getSidebarOpened,
    openSidebar: useStore.appStore.getSidebarOpened,
    withoutAnimation: withoutAnimation,
    mobile: false,
  };
});

</script>

<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar />
    <div class="main-container">
      <!--Navbar-->
      <div :class="{ 'fixed-header': fixedHeader, 'hide-header': hideHeader }" >
        <navbar />
        <tab />
      </div>
      <!-- <Horizontal/> -->
      <AppMain />
    </div>
    <Setting />
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  &::after {
    display: table;
    clear: both;
    content: "";
  }

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.tags-view {
  background: #fff;
  margin-top: 48px;
}
.hide-header {
  display: none;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 210px);
  transition: width 0.28s;
}
.app-mask {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
}

.re-screen {
  margin-top: 12px;
}


</style>
