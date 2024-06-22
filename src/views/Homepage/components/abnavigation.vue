<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import useStore from "@/store";

import { CloseBold } from "@element-plus/icons-vue";

const route = useRoute();
const naviOptions = computed(() => useStore.navigationStore.getNaviOptions());
const activeIndex = computed(() => useStore.navigationStore.getCurrentIndex());

const removeOption = (val) => {
  useStore.navigationStore.deleteOption(val);
  // if (currentIndex.value === tabName) {
  //   if (tabsOption.value && tabsOption.value.length) {
  //     useStore.tabStore.setCurrentIndex(
  //       tabsOption.value[tabsOption.value.length - 1].route
  //     );
  //     router.replace({ path: currentIndex.value });
  //   } else {
  //     router.replace({ path: "/" });
  //   }
  // }
};

onMounted(() => {
  useStore.navigationStore.initOptionList();
});
</script>

<template>
  <div class="w-full">
    <el-menu :default-active="activeIndex" router mode="horizontal">
      <el-menu-item class="menu-item" v-for="item in naviOptions" :index="item.path">
        <p>{{ item.meta.title }}</p>
        <el-icon
          v-if="!item?.meta?.fixed"
          class="icon !w-[20px] !h-[20px]"
          @click="removeOption(item)"
          ><CloseBold
        /></el-icon>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.el-menu {
  height: fit-content;
  background: transparent;
  border-bottom: 0;

  .el-menu-item {
    color: #fff !important;
    font-size: large !important;
    line-height: 36px;
    padding: 0 15px;

    .icon {
      display: none;
      background: none;
      border-radius: 50%;
    }

    .icon:hover {
      color: #000;
    }
  }

  ::v-deep(.el-sub-menu__title) {
    padding-right: 20px !important;
  }
}

.layout-theme-light body[layout="vertical"] .el-menu--horizontal .el-menu-item.is-active {
  font-weight: bolder;
  font-size: larger !important;
  color: #fff !important;
  background: transparent;
}

.layout-theme-light
  body[layout="vertical"]
  .el-menu--horizontal
  .nest-menu
  .el-sub-menu
  > .el-sub-menu__title:hover,
.layout-theme-light
  body[layout="vertical"]
  .el-menu--horizontal
  .menu-item:first-child:hover {
  background: none;
  color: #fff !important;

  p {
    opacity: 0.8;
  }

  .icon {
    display: block;
    padding-left: 3px;
  }
}

.layout-theme-light
  body[layout="vertical"]
  .el-menu--horizontal
  .nest-menu
  .el-sub-menu
  > .el-sub-menu__title:hover,
.layout-theme-light
  body[layout="vertical"]
  .el-menu--horizontal
  .menu-item:not(:first-child):hover {
  background: none;
  color: #fff !important;
  padding-right: 0;
  padding-left: 12px;

  p {
    opacity: 0.8;
  }

  .icon {
    padding-left: 3px;
    display: block;
  }
}

.el-popper .el-menu--horizontal .el-menu .menu-item {
  font-size: large !important;
  line-height: 36px;
  color: #000 !important;
}
// #409eff
</style>
