<script setup>
import { reactive, ref, watch, toRaw, computed } from "vue";
import { useUserStore } from "@/store/user";
import { usePermissionStore } from "@/store/permission";
import { loginRules } from "./utils/rule";
import { useRouter} from "vue-router";

import regist from "./components/regist.vue";
import update from "./components/update.vue";
import email from "./components/email.vue";

import bg from "@/assets/login/bg.png";
import left from "@/assets/login/left.png";
import illustration from "@/assets/login/illustration.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import Info from "@iconify-icons/ri/information-line";

const router = useRouter();
const permissionStore = usePermissionStore();
const loginForm = reactive({
  act: "",
  pwd: "",
});
const loginLoading = ref(false);
const checked = ref(false);
const loginFormRef = ref(null);
const currentPage = computed(() => {
  return useUserStore().state.currentPage;
});

const handleLogin = () => {
  permissionStore.getPermissionRoutes();
  permissionStore.getPermissions();
  router.push('/welcome')
};
</script>

<template>
  <div class="login">
    <div class="bg">
      <img :src="bg" class="wave" />
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
    </div>
    <div class="form">
      <div class="left">
        <div class="top">
          <div class="title">
            <span>基地管理系统</span>
          </div>
          <div class="desc">
            <h4>让社团管理更加简单</h4>
          </div>
        </div>
        <div class="bottom">
          <img :src="left" />
        </div>
      </div>
      <div class="right">
        <div class="welcome" v-if="currentPage === 0">
          <span>欢迎使用基地管理系统</span>
        </div>
        <el-form
          v-if="currentPage === 0"
          :rules="loginRules"
          ref="loginFormRef"
          class="login_form"
          :model="loginForm"
        >
          <el-form-item prop="act">
            <el-input
              v-model="loginForm.act"
              clearable
              placeholder="请输入学号"
            >
              <template #prefix>
                <IconifyIconOffline
                  :icon="User"
                  width="14"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="pwd">
            <el-input
              placeholder="请输入登录密码"
              v-model="loginForm.pwd"
              clearable
              show-password
              @keyup.enter.native="handleLogin"
            >
              <template #prefix>
                <IconifyIconOffline
                  :icon="Lock"
                  width="14"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <div class="w-full h-[20px] flex justify-between items-center">
              <el-checkbox v-model="checked">
                <span class="flex">
                  7天免登录
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    content="勾选并登录后，规定天数内无需输入用户名和密码会自动登入系统"
                  >
                    <IconifyIconOffline :icon="Info" width="14" />
                  </el-tooltip>
                </span>
              </el-checkbox>
              <el-button link @click="useUserStore().setCurrentPage(1)">
                免费注册
              </el-button>
              <el-button
                link
                type="primary"
                @click="useUserStore().setCurrentPage(3)"
              >
                忘记密码？
              </el-button>
            </div>
            <el-button
              type="primary"
              @click.native.prevent="handleLogin"
              class="w-full mt-4"
              :loading="loginLoading"
            >
              登录
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-divider>
              <p class="text-gray-500 text-xs">快捷登陆方式</p>
            </el-divider>
            <div class="w-full flex justify-evenly">
              <span @click="useUserStore().setCurrentPage(2)">
                <IconifyIconOnline
                  icon="ic:baseline-email"
                  width="20"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                />
              </span>
              <span>
                <IconifyIconOnline
                  icon="ri:wechat-fill"
                  width="20"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                /> </span
              ><span>
                <IconifyIconOnline
                  icon="ri:qq-fill"
                  width="20"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                />
              </span>
            </div>
          </el-form-item>
        </el-form>
        <regist v-if="currentPage === 1" />
        <email v-if="currentPage === 2" />
        <update v-if="currentPage === 3" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.form {
  width: 700px;
  height: 464px;
  position: relative;
  flex-direction: row;
  display: flex;
  justify-content: space-evenly;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 0 10px 5px rgba(34, 84, 142, 0.26);
}

.wave {
  position: fixed;
  height: 100%;
  width: 80%;
  left: 0;
  bottom: 0;
  z-index: -1;
  margin: 0px;
}

.left {
  width: 50%;
}

.left img {
  width: 100%;
  height: auto;
  overflow: hidden;
}

.top {
  width: 50%;
  position: absolute;
  padding: 20px;
  color: white;
}

.title {
  font-size: 15px;
  margin-bottom: 10px;
}

.desc {
  width: 100%;
  font-size: 22px;
  text-align: center;
}

.welcome {
  font-size: 20px;
  font-family: "STKaiTi";
  margin-bottom: 20px;
}

.right {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 30px;
}
</style>
import { usePermissionStore } from "../../store/permission";import { usePermissionStore } from "../../store/permission";
import { useRouter } from "vue-router";

