<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useFullscreen } from "@vueuse/core";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Search from "@/components/Search/index.vue";
import ClubSelection from "@/components/ClubSelection/index.vue";
import avatar from "@/assets/avatar-default.png";
import { message } from "@/utils/message";
import useStore from "@/store";
import Full from "@iconify-icons/ri/fullscreen-fill";
import ExitFull from "@iconify-icons/ri/fullscreen-exit-fill";
import Bell from "@iconify-icons/ep/bell";
import Base from "@iconify-icons/ri/bar-chart-box-fill";
import LogoutCircle from "@iconify-icons/ri/logout-circle-r-line";
import UserSetting from "@iconify-icons/ri/user-settings-line";

const props = defineProps({
  primary: {
    default: "#fff",
    type: String,
  },
});

const router = useRouter();
const { isFullscreen, toggle } = useFullscreen();
isFullscreen.value = !!(
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement
);

const screenIcon = ref();
const messageNum = ref(5);
const opened = computed(() => useStore.appStore.getSidebarOpened);
const name = computed(() => useStore.userStore.getName);

const toggleSideBar = () => {
  useStore.appStore.toggle_sidebar();
};

const logout = async () => {
  await useStore.userStore
    .logout()
    .then(() => {
      message("退出登陆成功", { type: "success" });
      router.replace("/login");
    })
    .catch((error) => {
      console.error(error.message);
    });
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
  <div class="navbar bg-[#fff] shadow-sm shadow-[rgba(0,21,41,0.08)]">
    <breadcrumb class="breadcrumb-container" />
    <div class="vertical-header-right">
      <div class="mr-4">
        <ClubSelection />
      </div>
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
              <el-dropdown-item
                ><IconifyIconOffline
                  :icon="Base"
                  style="margin: 5px"
                />首页</el-dropdown-item
              >
            </router-link>
            <router-link to="/personal/index">
              <el-dropdown-item
                ><IconifyIconOffline
                  :icon="UserSetting"
                  style="margin: 5px"
                />个人设置</el-dropdown-item
              >
            </router-link>
            <el-dropdown-item divided>
              <IconifyIconOffline :icon="LogoutCircle" style="margin: 5px" />
              <span style="display: block" @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 535px;
    height: 48px;
    color: #000000d9;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 48px;
      padding: 10px;
      color: #000000d9;
      cursor: pointer;

      p {
        font-size: 14px;
      }

      img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
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
