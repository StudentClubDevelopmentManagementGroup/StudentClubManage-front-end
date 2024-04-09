<script setup lang="ts">
import { h, ref, reactive, computed, defineComponent } from "vue";
import Sidebar from "./components/sidebar/index.vue";
import Horizontal from "./components/sidebar/horizontal.vue";
import Navbar from "./components/Navbar.vue";
import AppMain from "./components/AppMain.vue";
import Tab from "./components/tab";
import Setting from "./components/setting";
import useStore from "@/store";
import backTop from "@/assets/back_top.svg?component";

const showSetting = computed(() => useStore.settingStore.getShowSettings);
const opened = computed(() => useStore.appStore.getSidebarOpened);
const fixedHeader = computed(() => useStore.settingStore.getFixedHeader);
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

const layoutHeader = defineComponent({
  render() {
    return h(
      "div",
      {
        class: { "fixed-header": fixedHeader.value },
        style: [
          hideTabs && layout.value === "horizontal"
            ? "box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08)"
            : "",
        ],
      },
      {
        default: () => [
          layout.value === "vertical" || layout.value === "mix"
            ? h(Navbar)
            : null,
          layout.value === "horizontal" ? h(Horizontal) : null,
          h(Tab),
        ],
      }
    );
  },
});
</script>

<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar v-show="layout === 'vertical'" />
    <div
      :class="['main-container', layout !== 'vertical' ? 'main-hidden' : '']"
    >
      <div v-if="fixedHeader">
        <layout-header />
        <AppMain />
      </div>
      <el-scrollbar v-else>
        <el-backtop
          title="回到顶部"
          target=".main-container .el-scrollbar__wrap"
        >
          <backTop />
        </el-backtop>
        <layout-header />
        <AppMain />
      </el-scrollbar>
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
