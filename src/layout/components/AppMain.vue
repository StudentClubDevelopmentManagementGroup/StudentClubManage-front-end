<template>
  <section class="app-main">
    <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
      <el-scrollbar
        v-if="props.fixedHeader"
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
      ></el-scrollbar>
    </router-view>

    <router-view v-else v-slot="{ Component }">
      <div class="grow">
        <transition name="fade" mode="out-in">
          <keep-alive :include="$route.name">
            <component
              :is="Component"
              :key="$route.path"
              class="main-content"
            />
          </keep-alive>
        </transition>
      </div>
    </router-view>

    <Footer v-if="!hideFooter" />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useStore from "@/store";
import Footer from "./footer/index.vue";

const router = useRouter();

const tabsOption = computed(() => useStore.tabStore.getTabsOption);
const currentIndex = computed(() => useStore.tabStore.getCurrentIndex);
const hideFooter = computed(() => useStore.settingStore.getHideFooter);
// 移除tab
const removeTab = (tabName: string) => {
  if (tabName === "/welcome") {
    return;
  }
  useStore.tabStore.deleteTab(tabName);
  if (currentIndex.value === tabName) {
    if (tabsOption.value && tabsOption.value.length) {
      useStore.tabStore.setCurrentIndex(
        tabsOption.value[tabsOption.value.length - 1].route
      );
      router.replace({ path: currentIndex.value });
    } else {
      router.replace({ path: "/" });
    }
  }
};

// 点击tab
const clickTab = (tabName: { paneName: string }) => {
  useStore.tabStore.setCurrentIndex(tabName.paneName);
  router.replace({ path: currentIndex.value });
};
</script>

<style scoped>
.app-main {
  background-color: #fafbfe;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  padding-top: 82px;
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
