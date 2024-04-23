<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import useStore from "@/store";
import { useRoute } from "vue-router";

const route = useRoute();
const activeIndex = computed(() => {
  return useStore.useNavigationStore.currentIndex;
});
const hanldeSelect = (key, keyPath) => {
  useStore.useNavigationStore.setCurrentIndex(key);
};
onMounted(() => {
  useStore.useNavigationStore.setCurrentIndex(route.path);
});
</script>

<template>
  <div style="width: 100%">
    <el-menu
      :default-active="activeIndex"
      router
      mode="horizontal"
      @select="hanldeSelect"
    >
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item index="/club">社团信息</el-menu-item>
      <el-menu-item index="/recruitment">招新讯息</el-menu-item>
      <el-menu-item index="/activity">活动信息</el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.el-menu {
  height: fit-content;

  background: transparent;
  border-bottom: 0;
}
.el-menu-item {
  color: #fff !important;
  font-size: medium !important;
  line-height: 32px;
}
.el-menu-item.is-active {
  border-bottom: 2px red solid;
}
.layout-theme-light
  body[layout="vertical"]
  .el-menu--horizontal
  .nest-menu
  .el-sub-menu
  > .el-sub-menu__title:hover,
.layout-theme-light body[layout="vertical"] .el-menu--horizontal .el-menu-item:hover {
  color: #fff !important;
  background: none;
  opacity: 0.8;
}
.layout-theme-light body[layout="vertical"] .el-menu--horizontal .el-menu-item.is-active {
  /* TODO:样式待调整 */
  font-weight: bolder;
  color: #fff !important;
  background: transparent;
}
</style>
