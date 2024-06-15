<script setup lang="ts">
import SidebarItem from "./sidebarItem.vue";
import { ref, nextTick, computed, onMounted, watch } from "vue";
import logo from "@/assets/logo.png";
import Search from "@/components/Search/index.vue";
import ClubSelection from "@/components/ClubSelection/index.vue";
import { useRouter, useRoute } from "vue-router";
import useStore from "@/store";
import { useFullscreen } from "@vueuse/core";
import avatar from "@/assets/avatar-default.png";
import Full from "@iconify-icons/ri/fullscreen-fill";
import ExitFull from "@iconify-icons/ri/fullscreen-exit-fill";
import Bell from "@iconify-icons/ep/bell";

const { isFullscreen, toggle } = useFullscreen();
const route = useRoute();
const router = useRouter();

isFullscreen.value = !!(
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement
);

const menuRef = ref();
const messageNum = ref(5);
const screenIcon = ref();

const routes = computed(() =>
  useStore.permissionStore.accessRoutes.filter((route) => !route.meta.hidden)
);
const activeMenu = computed(() => useStore.tabStore.getCurrentIndex);
const opened = computed(() => useStore.appStore.getSidebarOpened);
const name = computed(() => useStore.userStore.getName);

nextTick(() => {
  menuRef.value?.handleResize();
});

onMounted(() => {
  const routePath = route.path;
  useStore.tabStore.setCurrentIndex(routePath);
});

const logout = async () => {
  await useStore.userStore.logout();
  router.replace("/login");
};

watch(
  isFullscreen,
  (full) => {
    screenIcon.value = full ? ExitFull : Full;
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div v-loading="routes.length === 0" class="horizontal-header">
    <div class="horizontal-header-left" @click="backTopMenu">
      <img :src="logo" alt="logo" class="rounded" />
      <span class="sidebar-title">欢迎您！{{ name }}</span>
    </div>
    <el-menu
      ref="menuRef"
      router
      mode="horizontal"
      popper-class="pure-scrollbar"
      class="horizontal-header-menu"
      :default-active="activeMenu"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <div class="mr-4">
        <ClubSelection :show-label="false" />
      </div>
      <!-- 菜单搜索 -->
      <search id="header-search"></search>
      <el-dropdown class="nitoce">
        <div class="dropdown-badge">
          <el-badge :value="messageNum" :max="99" class="message-badge" type="danger">
            <span class="header-notice-icon">
              <IconifyIconOffline :icon="Bell" />
            </span>
          </el-badge>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a">mike 回复了你的邮件</el-dropdown-item>
            <el-dropdown-item command="b">您有5个新任务</el-dropdown-item>
            <el-dropdown-item command="c">您已经和Jone成为了好友</el-dropdown-item>
            <el-dropdown-item command="d">项目验收通知</el-dropdown-item>
            <el-dropdown-item command="e" divided>新会议通知</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span id="fullScreen" class="fullscreen-icon navbar-bg-hover" @click="toggle">
        <IconifyIconOffline :icon="screenIcon" />
      </span>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img :src="avatar" style="margin-right: 10px" />
          <p v-if="name" class="dark:text-white">{{ name }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <router-link to="/personal/index">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <router-link to="/personal/personalSetting">
              <el-dropdown-item>个人设置</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display: block" @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}

.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}
</style>
