<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useStore from "@/store";
import Down from "@iconify-icons/ri/arrow-down-s-line";
const router = useRouter();

const hideTabs = computed(() => useStore.settingStore.getHideTabs);
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
    v-if="!hideTabs"
    id="Tabs"
    v-model="currentIndex"
    type="card"
    closable
    @tab-click="clickTab"
    @tab-remove="removeTab"
  >
    <template #add-icon>
      <IconifyIconOffline
        :icon="Down"
        width="20"
        class="cursor-pointer text-gray-500 hover:text-blue-400"
      />
    </template>
    <el-tab-pane
      v-for="item in tabsOption"
      :key="item.route"
      :label="item.title"
      :name="item.route"
    />
  </el-tabs>
</template>

<style lang="scss" scoped>
.el-tabs {
  background: #fff;
  box-shadow: 0 -1px 1px -1px #888;
  position: relative;
}
.el-tabs__header {
  margin-bottom: 0px !important;
}
</style>
