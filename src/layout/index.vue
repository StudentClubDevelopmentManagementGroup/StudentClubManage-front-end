<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import Sidebar from "./components/sidebar/index.vue";
import Horizontal from "./components/sidebar/horizontal.vue";
import Navbar from "./components/Navbar.vue";
import AppMain from "./components/AppMain.vue";
import Tab from "./components/tab";
import RightDrawer from "./components/setting/rightDrawer.vue";
import Color from "./components/setting/color.vue";
import Content from "./components/setting/content.vue";
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

const handleClickOutside = () => {
  useStore.appStore.closeSideBar({ withoutAnimation: false });
};

const handleSettingChange = (value: string) => {
  useStore.settingStore.changeSetting({ key: value });
};

const submitForm = (primary: string) => {
  // colors.primary = primary;
  // Object.assign(colors, generateColors(primary));
  // writeNewStyle(originalStylesheetCount.value, originalStyle.value, colors);
};
// getIndexStyle().then((data: any) => {
//   originalStyle.value = getStyleTemplate(data);
// });

const setLayoutModel = (layout) => {
  useStore.appStore.setLayout(layout)
};
</script>

<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar />
    <div class="main-container">
      <!--Navbar-->
      <div :class="{ 'fixed-header': fixedHeader, 'hide-header': hideHeader }">
        <navbar />
        <tab />
      </div>
      <!-- <Horizontal/> -->
      <AppMain />
    </div>
    <RightDrawer v-if="showSetting">
      <div class="setting-item">
        <div class="setting-draw-title">主题风格</div>
        <color @submit="submitForm"></color>
        <div class="divider"></div>
      </div>
      <div class="setting-item">
        <div class="setting-draw-title">导航模式</div>
        <ul class="pure-theme">
          <li
            ref="verticalRef"
            v-tippy="{
              content: '左侧菜单，亲切熟悉',
              zIndex: 41000,
            }"
            :class="layout === 'vertical' ? 'is-select' : ''"
            @click="setLayoutModel('vertical')"
          >
            <div />
            <div />
          </li>
          <li
            ref="horizontalRef"
            v-tippy="{
              content: '顶部菜单，简洁概览',
              zIndex: 41000,
            }"
            :class="layout === 'horizontal' ? 'is-select' : ''"
            @click="setLayoutModel('horizontal')"
          >
            <div />
            <div />
          </li>
        </ul>
        <div class="divider"></div>
      </div>
      <div class="setting-item">
        <div class="setting-draw-title">界面显示</div>
        <content
          @change="handleSettingChange('hideHeader')"
          @fixedHeader="handleSettingChange('fixedHeader')"
          @sidebarLogo="handleSettingChange('showLogo')"
          @hideTabs="handleSettingChange('hideTabs')"
          @hideFooter="handleSettingChange('hideFooter')"
        ></content>
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
.setting-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .setting-draw-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }
  .divider {
    width: 100%;
    display: flex;
    clear: both;
    min-width: 100%;
    margin: 10px 0;

    box-sizing: border-box;
    padding: 0px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    list-style: none;
    line-height: 1.5715;
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

.pure-theme {
  display: flex;
  gap: 12px;

  li {
    position: relative;
    width: 46px;
    height: 36px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f2f5;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 70%;
          height: 30%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30%;
          height: 70%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }
  }
}

.is-select {
  border: 2px solid var(--el-color-primary);
}
</style>
