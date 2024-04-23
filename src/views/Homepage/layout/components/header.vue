<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { User, SwitchButton } from "@element-plus/icons-vue";
import useStore from "@/store";
import { useRouter } from "vue-router";

import navbar from "./navigation.vue";
import search from "./search.vue";

const router = useRouter();

const logout = async () => {
  await useStore.userStore.logout();
  router.replace("/login");
};
const push2Management = () => {
  // TODO: 接上管理端的方法
  console.log("进入管理端");
};
</script>

<template>
  <div id="container">
    <div id="up-wrapper" class="container__mw">
      <div class="inner container__center">
        <div class="inner__div">
          <navbar />
        </div>
        <div class="inner__div inner-right">
          <!-- TODO:这里进入管理端：通过role判断是否显示 -->
          <el-button v-if="true" @click="push2Management" type="primary"
            >进入管理端</el-button
          >
          <div v-if="true" class="div-divider1"></div>
          <!-- TODO:这里添加用户名 -->
          <el-button :icon="User" type="primary">用户名占位符</el-button>
          <div class="div-divider1"></div>
          <el-button @click="logout" :icon="SwitchButton" type="primary">注销</el-button>
        </div>
      </div>
    </div>
    <div id="down-wrapper" class="container__mw">
      <div class="inner container__center">
        <div class="inner__div" style="height: 92px">
          <img src="@/assets/school-logo.png" alt="" />
        </div>
        <div class="inner__div">
          <img src="@/assets/school-motto.png" alt="" />
        </div>
        <div class="inner__div" style="flex: 2">
          <search />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#up-wrapper {
  background-image: url("@/assets/header-pattern1.png");
  background-color: rgb(0, 113, 174);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
#down-wrapper {
  padding: 12px;
  background-image: url("@/assets/header-pattern2.jpg");
  background-color: #fff;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}
.inner {
  display: flex;
  justify-content: space-between;
}
.inner__div {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.inner__div > img {
  height: 53px;
}
.inner-right {
  justify-content: right;
}
.inner-right .el-button {
  color: #fff;
  background: none !important;
  border: none !important;
}
.inner-right .el-button:hover {
  opacity: 0.8;
}
</style>
