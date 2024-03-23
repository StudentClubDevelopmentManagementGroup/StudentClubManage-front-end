<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useStore from "@/store";

const router = useRouter();

const tabsOption = computed(() => useStore.tabStore.getTabsOption);
const currentIndex = computed(() => useStore.tabStore.getCurrentIndex);
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

<template>
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
</template>

<style lang="scss" scoped></style>
