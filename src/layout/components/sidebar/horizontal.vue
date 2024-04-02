<script setup lang="ts">
import SidebarItem from "./sidebarItem.vue";
import { isAllEmpty } from "@pureadmin/utils";
import { ref, nextTick, computed } from "vue";
import Setting from "@iconify-icons/ri/settings-3-line";
import logo from "@/assets/logo.png";
import Search from "@/components/Search/index.vue";
import { useRouter } from "vue-router";
import useStore from "@/store";
import { toFullScreen, exitFullScreen } from "@/utils/screen";
import avatar from "@/assets/avatar-default.jpg";

const router = useRouter();
const menuRef = ref();
const fullScreen = ref(false);
const nickname = ref("车车");
const messageNum = ref(5);

const routes = computed(() => useStore.permissionStore.accessRoutes);
const activeMenu = computed(() => useStore.tabStore.getCurrentIndex);

nextTick(() => {
  menuRef.value?.handleResize();
});

const logout = () => {
  sessionStorage.removeItem("auth");
  sessionStorage.removeItem("accessToken");
  router.replace("/login");
};

const toShowFullScreen = () => {
  toFullScreen();
  fullScreen.value = true;
};

const toExitFullScreen = () => {
  exitFullScreen();
  fullScreen.value = false;
};
</script>

<template>
  <div v-loading="routes.length === 0" class="horizontal-header">
    <div class="horizontal-header-left" @click="backTopMenu">
      <img :src="logo" alt="logo" />
      <span class="sidebar-title">欢迎您！车立钧</span>
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
      <!-- 菜单搜索 -->
      <search id="header-search"></search>
      <!-- 通知 -->
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
          <p v-if="nickname" class="dark:text-white">{{ nickname }}</p>
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
      <span class="set-icon navbar-bg-hover" title="打开系统配置" @click="">
        <IconifyIconOffline :icon="Setting" />
      </span>
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

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.horizontal-header-right {
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

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
