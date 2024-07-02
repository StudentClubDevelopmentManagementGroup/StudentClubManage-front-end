<script setup lang="ts">
import { ref, onMounted, computed, h } from "vue";
import { User, SwitchButton } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { addDialog } from "@/components/Dialog";
import { deviceDetection } from "@pureadmin/utils";
import toRouterForm from "./toRouterForm.vue";
import useStore from "@/store";

import navbar from "./navigation.vue";
import search from "./search.vue";

const router = useRouter();
const route = useRoute();
const formRef = ref();
const userInfo = computed(() => useStore.userStore.getUserInfo);
const roleSuperAdmin = computed(() => useStore.clubStore.getRoleSuperAdmin());
const isShowManagementBtn = computed(
  () => useStore.clubStore.getRoleSuperAdmin() || useStore.clubStore.getRoleClubMember()
);

const logout = async () => {
  await useStore.userStore.logout();
  router.replace("/login");
};

function openDialog(title) {
  let state = 0;
  if (title === "进入管理端") {
    state = 1;
  }
  addDialog({
    title: title,
    props: {
      formInline: {},
    },
    width: "32%",
    draggable: true,
    fullscreen: deviceDetection(),
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(toRouterForm),
    beforeSure: (done, { options }) => {
      function chores() {
        done(); // 关闭弹框
      }
      // 表单规则校验通过
      if (state === 1) {
        useStore.permissionStore.getPermissionRoutes();
        useStore.permissionStore.getRoutes();
        router.push(useStore.permissionStore.getFirstRoute);
      }
      chores();
    },
  });
}

onMounted(() => {
  useStore.clubStore.isAvailable();
});
</script>

<template>
  <div>
    <div class="up-wrapper container__mwidth">
      <div class="container-width flex justify-between m-auto">
        <div class="overflow-hidden">
          <navbar />
        </div>
        <div class="btn-container flex items-center">
          <router-link to="/ad">
            <el-button v-if="roleSuperAdmin" class="!pr-2 !pl-2" type="primary">
              【进入管理端】
            </el-button>
          </router-link>

          <el-divider v-if="roleSuperAdmin" direction="vertical" border-style="solid" />

          <el-button
            class="!pr-2 !pl-2"
            v-if="isShowManagementBtn"
            @click="openDialog('进入管理端')"
            type="primary"
          >
            【进入基地管理端】
          </el-button>
          <el-divider
            v-if="isShowManagementBtn"
            direction="vertical"
            border-style="solid"
          />

          <template v-if="!userInfo">
            <el-button
              class="!pr-2 !pl-2"
              :icon="User"
              type="primary"
              @click="() => router.push('/login')"
            >
              未登录
            </el-button>
          </template>

          <template v-else>
            <router-link to="/homepage/personal">
              <el-button class="!pr-2 !pl-2" :icon="User" type="primary">
                {{ userInfo.name }}
              </el-button>
            </router-link>
          </template>

          <el-divider direction="vertical" border-style="solid" />

          <el-button
            v-if="userInfo.name"
            class="!pr-2 !pl-2"
            :icon="SwitchButton"
            type="primary"
            @click="logout"
            >退出登录</el-button
          >
        </div>
      </div>
    </div>
    <div
      v-if="!route.fullPath.includes('/homepage/personal')"
      class="down-wrapper container__mwidth"
    >
      <div class="container-width flex items-center justify-end m-auto h-[92px]">
        <search class="!w-[636px]" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.up-wrapper {
  background-image: url("@/assets/header-pattern1.png");
  background-color: rgb(0, 113, 174);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
.down-wrapper {
  padding: 12px;
  background-image: url("@/assets/header-pattern2.jpg");
  background-color: #fff;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
.btn-container {
  .el-button {
    color: #fff;
    background: none !important;
    border: none !important;
  }

  .el-button:hover {
    opacity: 0.8;
  }
}
</style>
