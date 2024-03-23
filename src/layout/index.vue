<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import Sidebar from "./components/sidebar/index.vue";
import Navbar from "./components/Navbar.vue";
import AppMain from "./components/AppMain.vue";
import Tab from "./components/tab";
import RightDrawer from "./components/setting/rightDrawer.vue";
import Color from "./components/setting/color.vue";
import Content from "./components/setting/content.vue";

import useStore from "@/store";
const showSetting = computed(() => useStore.settingStore.getShowSettings);
const fixedHeader = computed(() => useStore.settingStore.getFixedHeader);
const hideHeader = computed(() => useStore.settingStore.getHideHeader);
const withoutAnimation = computed(
  () => useStore.appStore.getSidebarWithoutAnimation
);
const originalStylesheetCount = computed(
  () => document.styleSheets.length || -1
);
const classObj = reactive({
  hideSidebar: false,
  openSidebar: true,
  withoutAnimation: false,
  mobile: false,
});

const handleClickOutside = () => {
  useStore.appStore.closeSideBar({ withoutAnimation: false });
};
const handleHeaderChange = () => {};

const handleFixedHeaderChange = () => {};
const handleSidebarLogoChange = () => {
  useStore.settingStore({ key: "showLogo", value: true });
};

const submitForm = (primary: string) => {
  // colors.primary = primary;
  // Object.assign(colors, generateColors(primary));
  // writeNewStyle(originalStylesheetCount.value, originalStyle.value, colors);
};
// getIndexStyle().then((data: any) => {
//   originalStyle.value = getStyleTemplate(data);
// });
</script>

<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar />
    <div class="main-container">
      <!--Navbar-->
      <div :class="{ 'fixed-header': fixedHeader, 'hide-header': hideHeader }">
        <navbar />
      </div>
      <div class="tags-view">
        <tab />
      </div>
      <AppMain />
    </div>
    <RightDrawer v-if="showSetting">
      <div class="setting-item">
        <div class="setting-draw-title">主题风格</div>

        <color @submit="submitForm"></color>
        <div class="divider"></div>
      </div>
      <div class="setting-item">
        <div class="setting-draw-title">内容区域</div>
        <content
          @change="handleHeaderChange"
          @fixedHeader="handleFixedHeaderChange"
          @sidebarLogo="handleSidebarLogoChange"
        ></content>
        <div class="divider"></div>
      </div>
    </RightDrawer>
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
  padding-top: 51px;
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
