<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";

import headview from "./components/header.vue";
import feet from "./components/footer.vue";
import backTop from "@/assets/back_top.svg?component";

const route = useRoute();

// <el-backtop target=".el-scrollbar__wrap" :visibility-height="100">
//         <backTop />
//       </el-backtop>
</script>

<template>
  <div id="container">
    <el-scrollbar height="100vh">
      <el-backtop
        target=".el-scrollbar__wrap"
        :visibility-height="100"
        :right="300"
        :bottom="350"
      >
        <backTop />
      </el-backtop>
      <el-container>
        <el-header>
          <headview />
        </el-header>
        <el-main>
          <router-view v-slot="{ Component }" :key="route.fullPath">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
        <el-footer>
          <feet />
        </el-footer>
      </el-container>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.el-container {
  background-image: url("@/assets/background-pattern.jpg");
  background-color: rgb(236, 236, 236);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
.el-header,
.el-main,
.el-footer {
  height: fit-content;
  padding: 0px;
}
.el-main {
  overflow: hidden;
}
</style>
