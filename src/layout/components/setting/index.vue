<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import RightDrawer from "./rightDrawer.vue";
import Content from "./content.vue";
import useStore from "@/store";
import { getConfig } from "@/config";
import {
  darken,
  lighten,
  toggleTheme,
} from "@pureadmin/theme/dist/browser-utils";
import Check from "@iconify-icons/ep/check";

const themeColors = ref([
  /* 亮白色 */
  { color: "#ffffff", themeColor: "light" },
  /* 道奇蓝 */
  { color: "#1b2a47", themeColor: "default" },
  /* 深紫罗兰色 */
  { color: "#722ed1", themeColor: "saucePurple" },
  /* 深粉色 */
  { color: "#eb2f96", themeColor: "pink" },
  /* 猩红色 */
  { color: "#f5222d", themeColor: "dusk" },
  /* 橙红色 */
  { color: "#fa541c", themeColor: "volcano" },
  /* 绿宝石 */
  { color: "#13c2c2", themeColor: "mingQing" },
  /* 酸橙绿 */
  { color: "#52c41a", themeColor: "auroraGreen" },
]);

const dataTheme = computed(() => getConfig().DarkMode);
const showSetting = computed(() => useStore.settingStore.getShowSettings);
const opened = computed(() => useStore.appStore.getSidebarOpened);
const fixedHeader = computed(() => useStore.settingStore.getFixedHeader);
const layout = computed(() => useStore.appStore.getLayout);
const layoutTheme = computed(() => useStore.appStore.getTheme);

const handleClickOutside = () => {
  useStore.appStore.closeSideBar({ withoutAnimation: false });
};

const getThemeColorStyle = computed(() => {
  return (color) => {
    return { background: color };
  };
});

const getThemeColor = computed(() => {
  return (current) => {
    if (current === layoutTheme.value && layoutTheme.value !== "light") {
      return "#fff";
    } else if (current === layoutTheme.value && layoutTheme.value === "light") {
      return "#1d2b45";
    } else {
      return "transparent";
    }
  };
});

function setLayoutThemeColor(
  theme = getConfig().Theme ?? "light",
  isClick = true
) {
  useStore.appStore.setTheme(theme);
  toggleTheme({
    scopeName: `layout-theme-${theme}`,
  });

  if (theme === "default" || theme === "light") {
    setEpThemeColor(getConfig().EpThemeColor);
  } else {
    const colors = themeColors.value.find((v) => v.themeColor === theme);
    setEpThemeColor(colors.color);
  }
}

function setPropertyPrimary(mode: string, i: number, color: string) {
  document.documentElement.style.setProperty(
    `--el-color-primary-${mode}-${i}`,
    dataTheme.value ? darken(color, i / 10) : lighten(color, i / 10)
  );
}

/** 设置 `element-plus` 主题色 */
const setEpThemeColor = (color: string) => {
  useStore.themeStore.setEpThemeColor(color);
  document.documentElement.style.setProperty("--el-color-primary", color);
  for (let i = 1; i <= 2; i++) {
    setPropertyPrimary("dark", i, color);
  }
  for (let i = 1; i <= 9; i++) {
    setPropertyPrimary("light", i, color);
  }
};

function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "").trim();
  targetEl.className = flag ? `${className} ${clsName}` : className;
}

/** 灰色模式设置 */
const greyChange = (value): void => {
  const htmlEl = document.querySelector("html");
  toggleClass(value, "html-grey", htmlEl);
};

/** 色弱模式设置 */
const weekChange = (value): void => {
  const htmlEl = document.querySelector("html");
  toggleClass(value, "html-weakness", htmlEl);
};

const handleSettingChange = (value: string) => {
  useStore.settingStore.changeSetting({ key: value });
};

const submitForm = (primary: string) => {};

const setLayoutModel = (layout) => {
  window.document.body.setAttribute("layout", layout);
  useStore.appStore.setLayout(layout);
};
</script>

<template>
  <RightDrawer v-if="showSetting">
    <div>
      <div class="setting-item">
        <p class="mt-5 mb-3 font-medium text-sm dark:text-white">主题色</p>
        <ul class="theme-color">
          <li
            v-for="(item, index) in themeColors"
            :key="index"
            :style="getThemeColorStyle(item.color)"
            @click="setLayoutThemeColor(item.themeColor)"
          >
            <el-icon
              style="margin: 0.1em 0.1em 0 0"
              :size="17"
              :color="getThemeColor(item.themeColor)"
            >
              <IconifyIconOffline :icon="Check" />
            </el-icon>
          </li>
        </ul>
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
          @greyChange = "greyChange"
          @weekChange = "weekChange"
          @fixedHeader="handleSettingChange('fixedHeader')"
          @sidebarLogo="handleSettingChange('showLogo')"
          @hideTabs="handleSettingChange('hideTabs')"
          @hideFooter="handleSettingChange('hideFooter')"
        ></content>
      </div>
    </div>
  </RightDrawer>
</template>

<style lang="scss" scoped>
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
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
}

.theme-color {
  height: 20px;

  li {
    float: left;
    height: 20px;
    margin-right: 8px;
    cursor: pointer;
    border-radius: 4px;

    &:nth-child(1) {
      border: 1px solid #ddd;
    }
  }
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
