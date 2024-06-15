<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import useStore from "@/store";

const router = useRouter();
const naviOptions = computed(() => useStore.navigationStore.getNaviOptions());
const activeIndex = computed(() => useStore.navigationStore.getCurrentIndex());

const currentIndex = ref(activeIndex.value);

watch(activeIndex, (newValue) => {
  currentIndex.value = newValue;
  router.replace(activeIndex.value);
});

const removeOption = (path) => {
  if (path !== "/homepage/home") {
    // 防止修改html获得首页的关闭按钮
    useStore.navigationStore.deleteOption(path);
  }
  if (currentIndex.value === path) {
    // 关闭的事当前的标签
    if (naviOptions?.value?.length) {
      var target = naviOptions.value[naviOptions.value.length - 1];
      useStore.navigationStore.setCurrentIndex(target.path);
      router.replace(target);
    }
  }
};

const clickOption = (option) => {
  router.replace(naviOptions.value[option.index].path);
};
</script>

<template>
  <div class="w-full">
    <el-tabs
      id="Tabs"
      v-model="currentIndex"
      type="card"
      @tab-click="clickOption"
      @tab-remove="removeOption"
    >
      <el-tab-pane
        v-for="item in naviOptions"
        :closable="!item?.meta?.fixed"
        :key="item.path"
        :label="item.meta.title"
        :name="item.path"
      />
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.el-tabs {
  ::v-deep(.el-tabs__header) {
    margin-bottom: 0;
    border: 0;
  }

  ::v-deep(.el-tabs__nav) {
    border: none !important;
  }

  ::v-deep(.el-tabs__item) {
    color: #fff !important;
    font-size: large !important;
    border: 0 !important;
  }

  ::v-deep(.el-tabs__item:hover) {
    font-weight: bolder;
  }

  ::v-deep(.is-active) {
    font-weight: bolder;
    border-bottom: 4px solid #299ef2 !important;
  }

  ::v-deep(.el-tabs__nav-prev),
  ::v-deep(.el-tabs__nav-next) {
    color: #fff;
  }
}
// #299ef2
</style>
