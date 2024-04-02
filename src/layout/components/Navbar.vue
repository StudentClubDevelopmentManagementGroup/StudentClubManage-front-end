<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Hamburger from "@/components/Hamburger/Hamburger.vue";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Search from "@/components/Search/index.vue";
import avatar from "@/assets/avatar-default.jpg";
import { toFullScreen, exitFullScreen } from "@/utils/screen";
import useStore from "@/store";
import Full from "@iconify-icons/ri/fullscreen-fill";
import ExitFull from "@iconify-icons/ri/fullscreen-exit-fill";
import Setting from "@iconify-icons/ri/settings-3-line";
import {GetUserInfo} from '@/utils/auth'
const props = defineProps({
  primary: {
    default: "#fff",
    type: String,
  },
});

const router = useRouter();


const fullScreen = ref(false);
const messageNum = ref(5);
const opened = computed(() => useStore.appStore.getSidebarOpened);
const name  =  computed(() => useStore.userStore.getName);
onMounted(() => {
  const userInfo = GetUserInfo();
  if (userInfo) {
    name.value = userInfo.name;
  }
});

// methods
const toggleSideBar = () => {
  useStore.appStore.toggle_sidebar();
};

const toShowFullScreen = () => {
  toFullScreen();
  fullScreen.value = true;
};

const toExitFullScreen = () => {
  exitFullScreen();
  fullScreen.value = false;
};

const logout = () => {
  sessionStorage.removeItem("auth");
  sessionStorage.removeItem("accessToken");
  router.replace("/login");
};
</script>

<template>
  <div class="navbar bg-[#fff] shadow-sm shadow-[rgba(0,21,41,0.08)]">
    <Hamburger
      id="Hamburger"
      :is-active="opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="vertical-header-right right-menu">
      <search id="header-search"></search>
      <div id="Message" class="right-menu-box">
        <el-dropdown>
          <el-badge
            :value="messageNum"
            :max="99"
            class="message-badge"
            type="danger"
          >
            <el-button class="message">
              <el-icon><Message /></el-icon>
            </el-button>
          </el-badge>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a"
                >mike 回复了你的邮件</el-dropdown-item
              >
              <el-dropdown-item command="b">您有5个新任务</el-dropdown-item>
              <el-dropdown-item command="c"
                >您已经和Jone成为了好友</el-dropdown-item
              >
              <el-dropdown-item command="d">项目验收通知</el-dropdown-item>
              <el-dropdown-item command="e" divided
                >新会议通知</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div id="fullScreen" class="right-menu-box">
        <el-button class="full-screen">
          <el-tooltip content="全屏预览" effect="light" placement="bottom">
            <IconifyIconOffline
              :icon="Full"
              v-show="!fullScreen"
              width="20"
              @click="toShowFullScreen()"
            />
          </el-tooltip>
          <el-tooltip content="退出全屏" effect="light" placement="bottom">
            <IconifyIconOffline
              :icon="ExitFull"
              v-show="fullScreen"
              width="20"
              @click="toExitFullScreen()"
            />
          </el-tooltip>
        </el-button>
      </div>
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
            <router-link to="/personal/personalCenter">
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
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;

    .right-menu-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .message-badge {
      .is-fixed {
        top: 12px !important;
        right: 28px !important;
      }
      .message {
        background-color: transparent;
        border: none;
        padding: 5px 20px;

        i {
          background-color: transparent;
          border: none;
          color: #2c3e50;
          font-size: 25px;
        }
      }
    }

    .full-screen {
      background-color: transparent;
      border: none;
      padding: 5px 20px;

      i {
        background-color: transparent;
        border: none;
        color: #2c3e50;
        font-size: 28px;
      }
    }
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

.avatar-container {
  margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;
    cursor: pointer;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
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
</style>
