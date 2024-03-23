<template>
  <section class="app-main">
    <!-- <div class="tags-view">
      <el-tabs
        id="Tabs"
        v-model="currentIndex"
        type="card"
        closable
        @tab-click="clickTab"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="item in tabsOption"
          :key="item.route"
          :label="item.title"
          :name="item.route"
        />
      </el-tabs>
    </div> -->
    <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </transition>
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
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useStore from "@/store";

const router = useRouter();

const tabsOption = computed(() => useStore.tabStore.getTabsOption);
const currentIndex = computed(() => useStore.tabStore.getCurrentIndex);

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
