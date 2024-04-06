<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <el-scrollbar
        :wrap-style="{
          display: 'flex',
          'flex-wrap': 'wrap',
          'max-width': '100%',
          margin: '0 auto',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }"
        :view-style="{
          display: 'flex',
          flex: 'auto',
          overflow: 'hidden',
          'flex-direction': 'column',
        }"
      >
        <el-backtop title="回到顶部" target=".app-main .el-scrollbar__wrap">
          <backTop />
        </el-backtop>
        <div class="grow">
          <transition name="fade" mode="out-in">
            <keep-alive v-if="$route.meta.keepAlive" :include="$route.name">
              <component
                :is="Component"
                :key="$route.path"
                class="main-content"
              />
            </keep-alive>
            <component
              v-else
              :is="Component"
              :key="$route.path"
              class="main-content"
            />
          </transition></div
      ><Footer v-if="!hideFooter" />
    </el-scrollbar>
    </router-view>

    
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useStore from "@/store";
import Footer from "./footer/index.vue";
import backTop from "@/assets/back_top.svg?component";

const hideFooter = computed(() => useStore.settingStore.getHideFooter);
</script>

<style scoped>
.app-main {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  padding-top: 102px
}

.app-main-nofixed-header {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-content {
  margin: 24px;
}
</style>
