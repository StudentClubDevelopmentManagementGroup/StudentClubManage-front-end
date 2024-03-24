<script setup>
import { reactive, ref, watch, toRaw, computed } from "vue";
import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { layoutStore } from "@/store/layout";

const router = useRouter();

const isCollapse = computed(() => {
  return !layoutStore().state.isCollapse;
});
//TODO：待处理的折叠/展开菜单方法
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
//TODO: 待处理的下拉菜单方法
const handleCommand = (command) => {
  if (command === "a") {
  } else if (command === "b") {
  } else if (command === "c") {
    router.push("/");
  }
};
</script>

<template>
  <el-container id="main-container">
    <!-- 侧边栏 -->
    <el-aside style="width: auto">
      <!-- 导航栏LOGO -->
      <div id="logo-container">
        <div id="logo">
          <iconify-icon
            id="logo-icon"
            icon="bytesize:desktop"
            width="36"
            height="36"
          ></iconify-icon>
          <span id="logo-text" v-if="!isCollapse">管理端</span>
        </div>
      </div>
      <!-- 导航栏菜单 -->
      <div id="navi-container">
        <el-menu
          default-active="base"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          router
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="/bm/base">
            <el-icon><OfficeBuilding /></el-icon>
            <template #title>基地管理</template>
          </el-menu-item>
          <el-menu-item index="/um/user">
            <el-icon><Avatar /></el-icon>
            <template #title>人员管理</template>
          </el-menu-item>
          <el-menu-item index="/pm/person">
            <el-icon><User /></el-icon>
            <template #title>个人信息</template>
          </el-menu-item>
          <el-menu-item index="/om/operation">
            <el-icon><document /></el-icon>
            <template #title>操作日志</template>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>
    <!-- 主体界面 -->
    <el-main>
      <!-- 头部区域 -->
      <el-affix>
        <div id="header">
          <div id="header-left">
            <el-switch v-model="layoutStore().state.isCollapse"></el-switch>
          </div>
          <div id="header-right">
            <el-dropdown @command="handleCommand">
              <div id="avatar-wrapper">
                <img
                  id="user-avatar"
                  src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
                />
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="a">个人信息</el-dropdown-item>
                  <el-dropdown-item command="b">返回首页</el-dropdown-item>
                  <el-dropdown-item command="c">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-affix>
      <!-- 预留页头标签页 -->
      <el-affix :offset="60">
        <div id="tags"></div>
      </el-affix>
      <!-- 功能界面 -->
      <div id="body">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
#main-container {
  height: 100%;
  width: 100%;
}
/* 边栏样式 */
.el-aside {
  background-color: #ffffff;
  color: #333;
  overflow: hidden;
}
#logo-container {
  height: auto;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #c5c5c5;
}
#logo {
  height: 50px;
  width: fit-content;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-left: 15px;
  margin: 5px 0px;
}
#logo-icon {
  color: #ffffff;
  background: #006eff;
  border-radius: 50%;
  margin-right: 10px;
  padding: 5px;
}
#logo-text {
  color: #006eff;
  font-size: large;
  font-weight: bolder;
}
#navi-container {
  height: 100%;
  width: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
/* 边栏样式 */

/* 主体界面样式 */
.el-main {
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  color: #333;
}
#header {
  height: 60px;
  min-width: 1600px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #85c1fe;
}
#header-left {
  padding-left: 10px;
  font-weight: bolder;
}
#header-right {
  margin-right: 30px;
}
#user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.el-icon--right {
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: 25px;
  font-size: 12px;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
#tags {
  height: 30px;
  min-width: 1600px;
  background: yellow;
}
#body {
  /* 减去tags与header的高度 */
  /*  TODO: 响应式布局需要 使用min-height，等完成表格的布局后回来修改这里 */
  /* min-height: calc(100% - 90px); */
  height: calc(100% - 90px);
}
/* 主体界面样式 */
</style>
